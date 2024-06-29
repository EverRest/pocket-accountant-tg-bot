function generateStarWarsName() {
    const names = ["Luke", "Leia", "Han", "Chewbacca", "Darth Vader", "Yoda", "R2-D2", "C-3PO", "Boba Fett", "Obi-Wan", "Anakin", "Padmé", "Qui-Gon", "Mace Windu", "Jar Jar Binks", "Lando Calrissian", "Kylo Ren", "Rey", "Finn", "Poe Dameron", "BB-8", "Jyn Erso", "Cassian Andor", "K-2SO", "Greedo", "Jabba the Hutt", "Wicket W. Warrick", "Admiral Ackbar", "Plo Koon", "Ahsoka Tano"];
    return names[Math.floor(Math.random() * names.length)];
}

module.exports = {
    generateStarWarsName,
};