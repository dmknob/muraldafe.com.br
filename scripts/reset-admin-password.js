#!/usr/bin/env node
// scripts/reset-admin-password.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔐 Reset de Senha Admin - Mural da Fé\n');

rl.question('Digite a nova senha: ', (newPassword) => {
    if (!newPassword || newPassword.length < 6) {
        console.error('❌ A senha deve ter pelo menos 6 caracteres.');
        rl.close();
        process.exit(1);
    }

    // Gerar hash SHA-256
    const hash = crypto.createHash('sha256').update(newPassword).digest('hex');

    console.log('\n✅ Hash gerado com sucesso!');
    console.log(`Hash: ${hash}`);

    // Ler o arquivo .env
    const envPath = path.join(__dirname, '../.env');
    let envContent = '';

    try {
        envContent = fs.readFileSync(envPath, 'utf-8');
    } catch (err) {
        console.error('❌ Erro ao ler arquivo .env:', err.message);
        rl.close();
        process.exit(1);
    }

    // Substituir ou adicionar ADMIN_HASH
    const lines = envContent.split('\n');
    let hashUpdated = false;

    const newLines = lines.map(line => {
        if (line.startsWith('ADMIN_HASH=')) {
            hashUpdated = true;
            return `ADMIN_HASH=${hash}`;
        }
        return line;
    });

    // Se ADMIN_HASH não existia, adiciona
    if (!hashUpdated) {
        newLines.splice(newLines.length - 1, 0, `ADMIN_HASH=${hash}`);
    }

    // Escrever de volta no .env
    try {
        fs.writeFileSync(envPath, newLines.join('\n'));
        console.log('\n✅ Arquivo .env atualizado com sucesso!');
        console.log(`\n📝 Nova senha configurada: "${newPassword}"`);
        console.log('🔄 Reinicie o servidor para aplicar as mudanças.\n');
    } catch (err) {
        console.error('❌ Erro ao escrever arquivo .env:', err.message);
        rl.close();
        process.exit(1);
    }

    rl.close();
});
