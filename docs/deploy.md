# Deploy em Produção - Mural da Fé

## Pré-requisitos

- VPS com Debian 12
- Node.js instalado (versão 18+)
- Nginx como reverse proxy
- Domínio configurado (muraldafe.com.br)
- Certificado SSL (Let's Encrypt recomendado)

## Variáveis de Ambiente (.env)

Crie um arquivo `.env` no servidor de produção com as seguintes variáveis:

```bash
NODE_ENV=production
DB_FILE=muraldafe-prod.db
PORT=3005
ADMIN_HASH=9b25b520eaffde335fe2cda2e4f7187a10fd6383abd1083ed8aaca9a53fe0703
SESSION_SECRET=seu_secret_complexo_aqui_use_openssl_rand_hex_32
```

**IMPORTANTE**: Gere um `SESSION_SECRET` forte usando:
```bash
openssl rand -hex 32
```

**Trocar a senha admin**:
```bash
node scripts/reset-admin-password.js
```

## Configuração do Nginx

O Nginx deve estar configurado como reverse proxy para o Node.js:

```nginx
server {
    listen 80;
    server_name muraldafe.com.br www.muraldafe.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name muraldafe.com.br www.muraldafe.com.br;

    ssl_certificate /etc/letsencrypt/live/muraldafe.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/muraldafe.com.br/privkey.pem;

    # Configurações SSL recomendadas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Tamanho máximo de upload (para imagens dos santinhos)
    client_max_body_size 20M;

    location / {
        # Proxy para Node.js
        proxy_pass http://localhost:3005;
        
        # Headers essenciais para sessões funcionarem
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
    }

    # Cache para arquivos estáticos
    location ~* \.(jpg|jpeg|png|webp|gif|ico|css|js)$ {
        proxy_pass http://localhost:3005;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**CRÍTICO**: Os headers `X-Forwarded-Proto` e `X-Forwarded-For` são essenciais para que o Express reconheça que está atrás de um proxy HTTPS.

## Configuração do Express

O arquivo `src/app.js` já está configurado com:

```javascript
// Trust proxy - CRÍTICO para produção com Nginx
app.set('trust proxy', 1);

// Sessão com cookies seguros
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,        // Apenas HTTPS
        httpOnly: true,      // Não acessível via JavaScript
        maxAge: 86400000,    // 24 horas
        sameSite: 'lax'      // Proteção CSRF
    }
}));
```

## Comandos de Deploy

### 1. Clonar/Atualizar Código
```bash
cd /var/www/muraldafe.com.br
git pull origin main
```

### 2. Instalar Dependências
```bash
npm install --production
```

### 3. Build do CSS
```bash
npm run build:css
```

### 4. Configurar Banco de Dados
```bash
# Primeira vez
npm run setup-db

# Copiar dados do dev (se necessário)
cp database/muraldafe-dev.db database/muraldafe-prod.db
```

### 5. Testar Localmente
```bash
npm start
# Acesse http://localhost:3005 para testar
```

### 6. Configurar PM2 (Process Manager)

Instalar PM2 globalmente:
```bash
npm install -g pm2
```

Criar arquivo `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'muraldafe',
    script: 'src/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

Iniciar aplicação:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 7. Verificar Status
```bash
pm2 status
pm2 logs muraldafe
```

## Troubleshooting

### Problema: Login não funciona (loop de redirecionamento)

**Sintomas**: Após tentar fazer login, volta para `/admin/login` sem erro.

**Causa**: Session cookies não estão sendo salvos.

**Soluções**:
1. Verificar que `app.set('trust proxy', 1)` está no código
2. Verificar que Nginx está enviando `X-Forwarded-Proto: https`
3. Verificar que `NODE_ENV=production` está no `.env`
4. Verificar logs do PM2: `pm2 logs muraldafe`

### Problema: Imagens não carregam

**Causa**: Arquivos estáticos não estão sendo servidos.

**Solução**:
1. Verificar que a pasta `public/` está no servidor
2. Verificar permissões: `chmod -R 755 public/`
3. Verificar configuração `express.static` no app.js

### Problema: Erro de banco de dados

**Causa**: SQLite não consegue escrever no arquivo.

**Solução**:
```bash
chmod 666 database/muraldafe-prod.db
chmod 755 database/
```

## Monitoramento

### Logs
```bash
# PM2
pm2 logs muraldafe --lines 100

# Nginx access
tail -f /var/log/nginx/access.log

# Nginx error
tail -f /var/log/nginx/error.log
```

### Reiniciar Aplicação
```bash
pm2 restart muraldafe
```

### Reiniciar Nginx
```bash
sudo systemctl restart nginx
```

## Backup

### Banco de Dados
```bash
# Criar backup
cp database/muraldafe-prod.db backups/muraldafe-$(date +%Y%m%d).db

# Agendar backup diário (crontab)
0 2 * * * cd /var/www/muraldafe.com.br && cp database/muraldafe-prod.db backups/muraldafe-$(date +\%Y\%m\%d).db
```

### Uploads
```bash
# Backup da pasta public/uploads
tar -czf backups/uploads-$(date +%Y%m%d).tar.gz public/uploads/
```

## Segurança

### Firewall (UFW)
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### SSL/TLS (Let's Encrypt)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d muraldafe.com.br -d www.muraldafe.com.br

# Renovação automática (já configurado pelo certbot)
sudo certbot renew --dry-run
```

## Atualização de Código

```bash
cd /var/www/muraldafe.com.br
git pull origin main
npm install --production
npm run build:css
pm2 restart muraldafe
```

## Checklist Pós-Deploy

- [ ] Site acessível via HTTPS
- [ ] Redirecionamento HTTP → HTTPS funciona
- [ ] Login admin funciona
- [ ] Páginas públicas carregam corretamente
- [ ] Imagens carregam (WebP)
- [ ] Formulários funcionam
- [ ] SEO: sitemap.xml acessível
- [ ] Backup configurado
- [ ] PM2 em modo startup
- [ ] Logs sendo gerados corretamente
