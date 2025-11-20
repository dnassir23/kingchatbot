const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config(); // ✅ Charge les variables d'environnement (.env ou Render)

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Sert ton interface (index.html + style.css) depuis le dossier public
app.use(express.static("public"));

// ✅ Route API pour le chatbot
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus", // modèle Cohere
        message: userMessage
      })
    });

    const data = await response.json();
    res.json({ reply: data.reply || "Je n’ai pas compris." });
  } catch (error) {
    console.error("Erreur API :", error);
    res.json({ reply: "Erreur serveur ou API." });
  }
});

// ✅ Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
