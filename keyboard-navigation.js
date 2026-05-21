/**
 * Keyboard Navigation Module for AeroMart E-commerce
 * Provides full keyboard accessibility support
 */

(function() {
  'use strict';

  // Initialize keyboard navigation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKeyboardNavigation);
  } else {
    initKeyboardNavigation();
  }

  function initKeyboardNavigation() {
    // Make all clickable elements keyboard accessible
    makeElementsKeyboardAccessible();
    
    // Initialize form field navigation (Enter to next field)
    initFormFieldNavigation();
    
    // Add keyboard event listeners
    addKeyboardEventListeners();
    
    // Initialize dropdown navigation
    initDropdownNavigation();
    
    // Initialize modal navigation
    initModalNavigation();
    
    // Initialize product card navigation
    initProductCardNavigation();
    
    // Initialize filter navigation
    initFilterNavigation();
    
    // Add focus indicators
    addFocusIndicators();
  }

  /**
   * Make all clickable elements keyboard accessible
   */
  function makeElementsKeyboardAccessible() {
    // Buttons - ensure they're focusable
    const buttons = document.querySelectorAll('button:not([tabindex="-1"])');
    buttons.forEach(btn => {
      if (!btn.hasAttribute('tabindex')) {
        btn.setAttribute('tabindex', '0');
      }
    });

    // Links - ensure they're focusable
    const links = document.querySelectorAll('a:not([tabindex="-1"])');
    links.forEach(link => {
      if (!link.hasAttribute('tabindex') && link.href && link.href !== '#') {
        link.setAttribute('tabindex', '0');
      }
    });

    // Product cards - make them focusable
    const productCards = document.querySelectorAll('.card, [class*="product-card"], [class*="card"]');
    productCards.forEach(card => {
      if (!card.hasAttribute('tabindex') && card.onclick) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
      }
    });

    // Category buttons
    const categoryButtons = document.querySelectorAll('.cat, [class*="category"], [class*="filter"]');
    categoryButtons.forEach(btn => {
      if (!btn.hasAttribute('tabindex')) {
        btn.setAttribute('tabindex', '0');
      }
    });

    // Menu items
    const menuItems = document.querySelectorAll('[role="menuitem"], nav a, .menu-item');
    menuItems.forEach(item => {
      if (!item.hasAttribute('tabindex')) {
        item.setAttribute('tabindex', '0');
      }
    });
  }

  /**
   * Initialize form field navigation (Enter to move to next field)
   */
  function initFormFieldNavigation() {
    document.addEventListener('keydown', function(e) {
      const target = e.target;
      
      // Handle Enter key in form fields
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Check if we're in a form input field
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          const inputType = target.type;
          
          // Skip for submit buttons, file inputs, and checkboxes/radios
          if (inputType === 'submit' || inputType === 'button' || inputType === 'file' || 
              inputType === 'checkbox' || inputType === 'radio') {
            return; // Let default behavior happen
          }
          
          // For textarea, only move to next field if Shift is not pressed
          // (Shift+Enter should create new line)
          if (target.tagName === 'TEXTAREA' && !e.shiftKey) {
            e.preventDefault();
            moveToNextField(target);
            return;
          }
          
          // For text inputs, move to next field
          if (target.tagName === 'INPUT' && 
              (inputType === 'text' || inputType === 'email' || inputType === 'tel' || 
               inputType === 'password' || inputType === 'number' || inputType === 'url' || 
               inputType === 'search' || !inputType)) {
            e.preventDefault();
            moveToNextField(target);
            return;
          }
        }
      }
    });
  }

  /**
   * Move focus to the next form field
   */
  function moveToNextField(currentField) {
    const form = currentField.closest('form');
    if (!form) {
      // If not in a form, try to find next field in document order
      moveToNextFieldInDocument(currentField);
      return;
    }
    
    // Get all focusable form fields in order (respecting tabindex)
    const allFields = Array.from(form.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([type="checkbox"]):not([type="radio"]), ' +
      'textarea, select, [contenteditable="true"]'
    )).filter(field => {
      // Filter out disabled and readonly fields
      return !field.disabled && !field.readOnly && field.offsetParent !== null;
    });
    
    if (allFields.length === 0) {
      moveToNextFieldInDocument(currentField);
      return;
    }
    
    const currentIndex = allFields.indexOf(currentField);
    
    if (currentIndex === -1) {
      moveToNextFieldInDocument(currentField);
      return;
    }
    
    // Find next field
    let nextIndex = currentIndex + 1;
    
    // If we're at the last field, check if there's a submit button
    if (nextIndex >= allFields.length) {
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
      if (submitButton && !submitButton.disabled) {
        // If form is valid, submit it; otherwise focus submit button
        if (form.checkValidity && form.checkValidity()) {
          submitButton.click();
        } else {
          submitButton.focus();
        }
        return;
      }
      // If no submit button, wrap around to first field
      nextIndex = 0;
    }
    
    // Focus next field
    const nextField = allFields[nextIndex];
    if (nextField) {
      nextField.focus();
      // Select text if it's a text input with existing value
      if (nextField.tagName === 'INPUT' && 
          (nextField.type === 'text' || nextField.type === 'email' || nextField.type === 'tel' || 
           nextField.type === 'password' || nextField.type === 'number' || nextField.type === 'url' || 
           nextField.type === 'search')) {
        // Only select if field has value
        if (nextField.value) {
          nextField.select();
        }
      }
    }
  }

  /**
   * Move to next field in document order (when not in a form)
   */
  function moveToNextFieldInDocument(currentField) {
    const allFields = Array.from(document.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([type="checkbox"]):not([type="radio"]), ' +
      'textarea, select'
    )).filter(field => {
      return !field.disabled && !field.readOnly && field.offsetParent !== null;
    });
    
    const currentIndex = allFields.indexOf(currentField);
    if (currentIndex === -1 || currentIndex === allFields.length - 1) return;
    
    const nextField = allFields[currentIndex + 1];
    if (nextField) {
      nextField.focus();
      if (nextField.tagName === 'INPUT' && nextField.value) {
        nextField.select();
      }
    }
  }

  /**
   * Add keyboard event listeners for Enter and Space
   */
  function addKeyboardEventListeners() {
    document.addEventListener('keydown', function(e) {
      const target = e.target;
      const isButton = target.tagName === 'BUTTON' || target.getAttribute('role') === 'button';
      const isLink = target.tagName === 'A' && target.href;
      const isClickable = target.onclick || target.getAttribute('onclick') || target.closest('[onclick]');
      const isCard = target.classList.contains('card') || target.closest('.card');
      
      // Enter key activation (but not for form fields - handled separately)
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Skip if it's a form input (handled by form navigation)
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return; // Let form navigation handle it
        }
        
        if (isButton || isLink || isClickable || isCard) {
          e.preventDefault();
          activateElement(target);
        }
      }
      
      // Space key activation (only for buttons, not links)
      if (e.key === ' ' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if ((isButton || target.getAttribute('role') === 'button' || isCard) && 
            target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && target.tagName !== 'SELECT') {
          e.preventDefault();
          activateElement(target);
        }
      }
    });
  }

  /**
   * Activate an element (click it)
   */
  function activateElement(element) {
    // Find the actual clickable element
    let clickableElement = element;
    
    // If it's inside a card, find the card's click handler
    if (element.closest('.card')) {
      clickableElement = element.closest('.card');
    }
    
    // Trigger click event
    if (clickableElement) {
      clickableElement.click();
    }
  }

  /**
   * Initialize dropdown navigation with arrow keys
   */
  function initDropdownNavigation() {
    const dropdowns = document.querySelectorAll('select, [role="listbox"], .dropdown, [class*="dropdown"]');
    
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          
          if (this.tagName === 'SELECT') {
            // Native select - let browser handle it, but ensure it's accessible
            const options = Array.from(this.options);
            const currentIndex = options.findIndex(opt => opt.selected);
            
            if (e.key === 'ArrowDown') {
              const nextIndex = Math.min(currentIndex + 1, options.length - 1);
              this.selectedIndex = nextIndex;
              this.dispatchEvent(new Event('change'));
            } else if (e.key === 'ArrowUp') {
              const prevIndex = Math.max(currentIndex - 1, 0);
              this.selectedIndex = prevIndex;
              this.dispatchEvent(new Event('change'));
            }
          } else {
            // Custom dropdown
            const items = this.querySelectorAll('[role="option"], option, .dropdown-item, [class*="option"]');
            const currentIndex = Array.from(items).findIndex(item => 
              item === document.activeElement || item.classList.contains('active') || item.getAttribute('aria-selected') === 'true'
            );
            
            if (items.length > 0) {
              let nextIndex;
              if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % items.length;
              } else {
                nextIndex = (currentIndex - 1 + items.length) % items.length;
              }
              
              items[nextIndex].focus();
              items[nextIndex].click();
            }
          }
        }
      });
    });
  }

  /**
   * Initialize modal navigation
   */
  function initModalNavigation() {
    // Handle modal opening/closing
    document.addEventListener('keydown', function(e) {
      // Escape key to close modals
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show, [class*="modal"][style*="display: block"], [id*="modal"].show');
        if (openModals.length > 0) {
          const lastModal = openModals[openModals.length - 1];
          const closeButton = lastModal.querySelector('.modal-close, [class*="close"], button[aria-label*="close" i]');
          if (closeButton) {
            closeButton.click();
          } else {
            // Try to find close function
            if (typeof closeModal === 'function') {
              closeModal(lastModal.id);
            }
          }
        }
      }
    });

    // Arrow key navigation within modals
    document.addEventListener('keydown', function(e) {
      const modal = document.querySelector('.modal.show, [class*="modal"][style*="display: block"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;

      const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement);
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        focusableElements[prevIndex].focus();
      }
    });
  }

  /**
   * Initialize product card navigation
   */
  function initProductCardNavigation() {
    // Make product cards navigable with arrow keys
    document.addEventListener('keydown', function(e) {
      const cards = Array.from(document.querySelectorAll('.card[tabindex="0"], .card[role="button"]'));
      if (cards.length === 0) return;

      const currentCard = document.activeElement.closest('.card');
      if (!currentCard || !cards.includes(currentCard)) return;

      const currentIndex = cards.indexOf(currentCard);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % cards.length;
        cards[nextIndex].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        cards[prevIndex].focus();
      }
    });
  }

  /**
   * Initialize filter navigation
   */
  function initFilterNavigation() {
    // Category filter buttons navigation
    const filterButtons = document.querySelectorAll('.cat, [class*="filter"], [class*="category"]');
    
    if (filterButtons.length > 0) {
      document.addEventListener('keydown', function(e) {
        const currentButton = Array.from(filterButtons).find(btn => btn === document.activeElement);
        if (!currentButton) return;

        const currentIndex = Array.from(filterButtons).indexOf(currentButton);

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % filterButtons.length;
          filterButtons[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + filterButtons.length) % filterButtons.length;
          filterButtons[prevIndex].focus();
        }
      });
    }
  }

  /**
   * Add visual focus indicators
   */
  function addFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced focus indicators for keyboard navigation */
      *:focus-visible,
      button:focus,
      a:focus,
      input:focus,
      select:focus,
      textarea:focus,
      .card:focus,
      [tabindex="0"]:focus {
        outline: 3px solid #37e8eb !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 2px rgba(55, 232, 235, 0.5) !important;
      }

      /* Focus indicator for product cards */
      .card:focus {
        transform: translateY(-4px) !important;
        box-shadow: 0 8px 24px rgba(55, 232, 235, 0.6) !important;
      }

      /* Focus indicator for buttons */
      button:focus,
      .btn:focus {
        outline: 3px solid #37e8eb !important;
        outline-offset: 2px !important;
      }

      /* Skip to main content link */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #2a5298;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
      }

      .skip-link:focus {
        top: 0;
      }
    `;
    document.head.appendChild(style);

    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('tabindex', '0');
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID if it doesn't exist
    const mainContent = document.querySelector('main, .main-content, [role="main"]');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }

  // Re-initialize when new content is added dynamically
  const observer = new MutationObserver(function(mutations) {
    let shouldReinit = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (node.classList && (
              node.classList.contains('card') ||
              node.classList.contains('modal') ||
              node.classList.contains('dropdown') ||
              node.querySelector('.card, .modal, .dropdown, button, a')
            )) {
              shouldReinit = true;
            }
          }
        });
      }
    });
    
    if (shouldReinit) {
      makeElementsKeyboardAccessible();
      initFormFieldNavigation();
      initProductCardNavigation();
      initFilterNavigation();
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();

