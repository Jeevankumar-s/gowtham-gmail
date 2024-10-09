import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import './App.css';

const { CLIENT_ID, API_KEY, SCOPES } = process.env;

const SendEmail = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
        scope: SCOPES,
      }).then(() => {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn);
        // Handle initial sign-in state
        setIsSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    };

    gapi.load('client:auth2', initClient);
  }, []);

  const sendEmail = () => {
    const encodedMessage = btoa(
      `From: gowthamd2305@gmail.com\r\n` +
      `To: ${recipient}\r\n` +
      `Subject: ${subject}\r\n\r\n` +
      `${message}`
    );

    gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: encodedMessage,
      },
    }).then(response => {
      console.log('Email sent successfully', response);
    }).catch(error => {
      console.error('Failed to send email', error);
    });
  };

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  return (
    <div className="App">
      {!isSignedIn ? (
        <button className="sign-in-button" onClick={handleSignIn}>Sign in with Google</button>
      ) : (
        <>
          <h2 className="email-header">Send an Email</h2>
          <form className="email-form">
            <div className="input-container">
              <label htmlFor="recipient">Recipient:</label>
              <input type="email" id="recipient" placeholder="example@gmail.com" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div className="input-container">
              <label htmlFor="subject">Subject:</label>
              <input type="text" id="subject" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="input-container">
              <label htmlFor="message">Message:</label>
              <textarea id="message" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="button-container">
              <button className="send-button" onClick={sendEmail}>Send Email</button>
              <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SendEmail;

