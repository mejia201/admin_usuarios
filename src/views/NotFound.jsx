import React from 'react';

export const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>¡Vaya! Página no encontrada.</h1>
      <p style={styles.message}>Lo sentimos, la página que buscas no existe.</p>
      <img
        src="https://media.giphy.com/media/3o7bu3Xkf5zJKQIvg8/giphy.gif"
        alt="Page not found"
        style={styles.gif}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#343a40',
  },
  message: {
    fontSize: '18px',
    color: '#6c757d',
    marginBottom: '20px',
  },
  gif: {
    width: '200px',
    height: 'auto',
  },
};
