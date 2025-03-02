// File: frontend/components/NavBar.js
import React from 'react';

export default function NavBar() {
  return (
    <header style={styles.headerContainer}>
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <span style={styles.brandName}>CodeSense</span>
          {/* <ul style={styles.navLinks}>
            <li style={styles.navItem}>
              Features <span style={styles.dropdownIcon}>▾</span>
            </li>
            <li style={styles.navItem}>
              Company <span style={styles.dropdownIcon}>▾</span>
            </li>
            <li style={styles.navItem}>
              Resources <span style={styles.dropdownIcon}>▾</span>
            </li>
            <li style={styles.navItem}>
              Docs <span style={styles.dropdownIcon}>▾</span>
            </li>
            <li style={styles.navItem}>Pricing</li>
          </ul> */}
        </div>
        <div style={styles.navRight}>
          {/* <span style={styles.signInButton}>GitHub</span> */}
          <button style={styles.getStartedButton}>GitHub →</button>
        </div>
      </nav>
    </header>
  );
}

const styles = {
  headerContainer: {
    width: '100%',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  brandName: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#fff',
    marginRight: '40px',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '30px',
    margin: 0,
    padding: 0,
  },
  navItem: {
    position: 'relative',
    fontSize: '1rem',
    color: '#d1d1d1',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  dropdownIcon: {
    marginLeft: '4px',
    fontSize: '0.8rem',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  signInButton: {
    fontSize: '1rem',
    color: '#d1d1d1',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  getStartedButton: {
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '30px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease',
  },
};
