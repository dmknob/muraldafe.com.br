/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ejs}"],
    theme: {
        extend: {
            colors: {
                primary: '#000000', // Preto absoluto
                wine: '#2c0e0e',    // Vinho profundo
                gold: '#D4AF37',    // Dourado
                ivory: '#FFFFF0',   // Marfim
            },
            fontFamily: {
                sans: ['Cinzel', 'serif'], // Títulos em Cinzel (mas usando como sans por padrão ou específico) - Specs diz Títulos.
                serif: ['Cardo', 'Playfair Display', 'serif'], // Corpo de texto
                display: ['Cinzel', 'serif'],
                body: ['Cardo', 'serif'],
            },
        },
    },
    plugins: [],
}
