'use client';

// Importation des hooks React et des composants nécessaires
import { useState, FormEvent } from 'react';
import Image from 'next/image';
import bot from '../assets/bot.svg';
import user from '../assets/user.svg';
import sendIcon from '../assets/send.svg';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Composant principal Chat
export default function Chat() {
  // État pour stocker l'historique des messages
  const [chatHistory, setChatHistory] = useState<Array<{ isAi: boolean; message: string; id: string }>>([]);
  // État pour gérer le chargement
  const [isLoading, setIsLoading] = useState(false);
  // État pour stocker l'entrée de l'utilisateur
  const [userInput, setUserInput] = useState('');

  // Fonction pour générer un ID unique pour chaque message
  function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
  }

  // Fonction pour gérer la soumission du formulaire
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    // Vérification si l'entrée n'est pas vide
    if (!userInput.trim()) return;

    // Ajout du message de l'utilisateur à l'historique
    const newUserMessage = { isAi: false, message: userInput, id: generateUniqueId() };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserInput('');

    // Ajout d'un message vide pour le bot en attente de réponse
    const botMessageId = generateUniqueId();
    setChatHistory(prev => [...prev, { isAi: true, message: '', id: botMessageId }]);
    
    // Activation de l'état de chargement
    setIsLoading(true);

    try {
      // Envoi de la requête au serveur
      const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput })
      });

      if (response.ok) {
        // Traitement de la réponse du serveur
        const data = await response.json();
        const botReply = data.bot.trim();
        
        // Mise à jour du message du bot dans l'historique
        setChatHistory(prev => 
          prev.map(msg => msg.id === botMessageId ? { ...msg, message: botReply } : msg)
        );
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      // Gestion des erreurs
      console.error('Error:', error);
      setChatHistory(prev => 
        prev.map(msg => msg.id === botMessageId ? { ...msg, message: "An error occurred" } : msg)
      );
    } finally {
      // Désactivation de l'état de chargement
      setIsLoading(false);
    }
  }

  // Rendu du composant
  return (
    <div className="chat-container">
      {/* Affichage des messages */}
      <div className="chat-messages">
        {chatHistory.map((chat) => (
          <div key={chat.id} className={`chat-message ${chat.isAi ? 'ai' : 'user'}`}>
            <div className="chat-image">
              <Image src={chat.isAi ? bot : user} alt={chat.isAi ? 'bot' : 'user'} width={30} height={30} />
            </div>
            <div className="message-content">{chat.message}</div>
          </div>
        ))}
        {/* Indicateur de chargement */}
        {isLoading && <div className="loading">Loading...</div>}
      </div>
      {/* Formulaire de saisie */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask your question here..."
        />
        <Button type="submit">
          <Image src={sendIcon} alt="Send" width={24} height={24} />
        </Button>
      </form>
    </div>
  );
}