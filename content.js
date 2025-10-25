// Pack Saver Extension - Fixed Version with Draggable Overlay and Button
console.log('Pack Saver Extension Loading...');

(function() {
  'use strict';

  let allProducts = [];
  let bestDeals = [];
  let isOverlayVisible = false;
  let isExtensionActive = true;
  let autoRefreshCount = 0;
  let processedElements = new WeakSet();

  // Overlay dragging state
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let overlayX = 20;
  let overlayY = 135;
  
  // Button dragging state
  let isButtonDragging = false;
  let buttonDragOffsetX = 0;
  let buttonDragOffsetY = 0;
  let buttonX = 20;
  let buttonY = 65;

  const hostname = window.location.hostname;
  let siteName = 'Unknown';
  let isEbay = false;
  let isAliexpress = false;
  let isTemu = false;
  let isAmazon = false;
  let isWalmart = false;
  let currencySymbol = '$';

  if (hostname.includes('ebay')) {
    isEbay = true;
    siteName = 'eBay';
  } else if (hostname.includes('aliexpress')) {
    isAliexpress = true;
    siteName = 'AliExpress';
  } else if (hostname.includes('temu')) {
    isTemu = true;
    siteName = 'Temu';
  } else if (hostname.includes('amazon')) {
    isAmazon = true;
    siteName = 'Amazon';
  } else if (hostname.includes('walmart')) {
    isWalmart = true;
    siteName = 'Walmart';
  }

  console.log('Detected site: ' + siteName);

  function detectCurrency() {
    currencySymbol = '$';
  }

  function isValidPrice(price) {
    return typeof price === 'number' && price > 0 && price < 50000 && !isNaN(price) && isFinite(price);
  }

  function extractDisplayedPricePerUnit(productElement) {
    try {
      const allText = productElement.textContent;
      
      if (isWalmart) {
        const walmartPattern = /(\d+\.?\d*)\s*c\/ea/i;
        const walmartMatch = allText.match(walmartPattern);
        if (walmartMatch) {
          const priceInCents = parseFloat(walmartMatch[1]);
          const priceInDollars = priceInCents / 100;
          if (isValidPrice(priceInDollars)) {
            console.log('Found Walmart price-per-unit: $' + priceInDollars);
            return priceInDollars;
          }
        }
      }
      
      const pattern1 = /\$(\d+\.?\d*)\s*\/\s*(pc|piece|count|item|pcs|ct)/i;
      const pattern2 = /\$(\d+\.?\d*)\s*each/i;
      
      const match1 = allText.match(pattern1);
      if (match1) {
        const pricePerUnit = parseFloat(match1[1]);
        if (isValidPrice(pricePerUnit)) {
          console.log('Found price-per-unit: $' + pricePerUnit);
          return pricePerUnit;
        }
      }
      
      const match2 = allText.match(pattern2);
      if (match2) {
        const pricePerUnit = parseFloat(match2[1]);
        if (isValidPrice(pricePerUnit)) {
          console.log('Found price-per-unit: $' + pricePerUnit);
          return pricePerUnit;
        }
      }
    } catch (e) {
      console.error('Error extracting price-per-unit:', e);
    }
    return null;
  }

  function extractQuantity(productElement, text) {
    const titleElement = productElement.querySelector('h2, h3, span.w_iUH7, ._2D9RBAXL');
    const titleOnly = titleElement ? titleElement.textContent : text;
    
    const multiMatch = titleOnly.match(/(\d+)\s*x\s*(\d+)/i);
    if (multiMatch) {
      return parseInt(multiMatch[1]) * parseInt(multiMatch[2]);
    }
    
    const patterns = [
      /(\d+)\s*pcs?\b/i,
      /(\d+)\s*pieces?\b/i,
      /(\d+)\s*pack\b/i,
      /pack\s+of\s+(\d+)/i,
      /(\d+)\s*count\b/i
    ];
    
    for (let i = 0; i < patterns.length; i++) {
      const match = titleOnly.match(patterns[i]);
      if (match) {
        const qty = parseInt(match[1]);
        if (qty >= 2 && qty <= 10000) {
          return qty;
        }
      }
    }
    return null;
  }

  function extractMainPrice(productElement) {
    const selectors = [
      'span[itemprop="price"]',
      '[data-automation-id="product-price"]',
      '._2XgTiMJi',
      '[data-type="price"]',
      '.a-price-whole',
      '.a-offscreen'
    ];

    if (isWalmart) {
      const priceElements = productElement.querySelectorAll('[data-automation-id*="price"], span[itemprop="price"]');
      for (let j = 0; j < priceElements.length; j++) {
        const text = priceElements[j].textContent.trim();
        const pricePattern = /^\$(\d{1,4})(\.\d{2})?$/;
        const match = text.match(pricePattern);
        if (match) {
          const dollars = parseInt(match[1]);
          const cents = match[2] ? parseFloat('0' + match[2]) : 0;
          const price = dollars + cents;
          if (isValidPrice(price)) {
            console.log('Extracted Walmart main price: $' + price + ' from: ' + text);
            return price;
          }
        }
      }
      
      const allSpans = productElement.querySelectorAll('span');
      for (let j = 0; j < allSpans.length; j++) {
        const text = allSpans[j].textContent.trim();
        if (text.indexOf('$') === 0 && text.length < 10) {
          const pricePattern = /^\$(\d{1,4})(\.\d{2})?$/;
          const match = text.match(pricePattern);
          if (match) {
            const dollars = parseInt(match[1]);
            const cents = match[2] ? parseFloat('0' + match[2]) : 0;
            const price = dollars + cents;
            if (isValidPrice(price)) {
              console.log('Extracted Walmart price from span: $' + price);
              return price;
            }
          }
        }
      }
    }

    for (let i = 0; i < selectors.length; i++) {
      const elements = productElement.querySelectorAll(selectors[i]);
      for (let j = 0; j < elements.length; j++) {
        const text = elements[j].textContent.trim();
        if (text.indexOf('$') !== -1 && text.length < 50) {
          const pricePattern = /\$(\d{1,4})\.(\d{2})/;
          const match = text.match(pricePattern);
          if (match) {
            const price = parseFloat(match[1] + '.' + match[2]);
            if (isValidPrice(price)) {
              console.log('Extracted price: $' + price);
              return price;
            }
          }
        }
      }
    }
    
    const fullText = productElement.textContent;
    const fallbackPattern = /\$(\d{1,4})\.(\d{2})/;
    const match = fullText.match(fallbackPattern);
    if (match) {
      const price = parseFloat(match[1] + '.' + match[2]);
      if (isValidPrice(price)) {
        console.log('Extracted fallback price: $' + price);
        return price;
      }
    }
    
    return null;
  }

  function analyzeProduct(item) {
    try {
      let pricePerItem = extractDisplayedPricePerUnit(item);
      
      let title = 'Unknown Product';
      let titleElement = null;
      
      if (isWalmart) {
        titleElement = item.querySelector('span.w_iUH7');
      } else if (isTemu) {
        titleElement = item.querySelector('._2D9RBAXL');
        if (!titleElement && item.hasAttribute('data-tooltip-title')) {
          title = item.getAttribute('data-tooltip-title');
        }
      } else if (isAliexpress) {
        titleElement = item.querySelector('[class*="title"]') || item.querySelector('h2');
      } else {
        titleElement = item.querySelector('h2, h3');
      }
      
      if (titleElement && titleElement.textContent) {
        title = titleElement.textContent.trim().substring(0, 100);
      }
      
      if (!title || title === 'Unknown Product') {
        title = 'Product - ' + siteName;
      }
      
      let price = null;
      
      if (isValidPrice(pricePerItem)) {
        const quantity = extractQuantity(item, item.textContent) || 1;
        const calculatedPrice = pricePerItem * quantity;
        
        return {
          element: item,
          price: calculatedPrice,
          basePrice: calculatedPrice,
          shipping: 0,
          quantity: quantity,
          pricePerItem: pricePerItem,
          title: title
        };
      }

      price = extractMainPrice(item);
      
      if (!isValidPrice(price)) {
        return null;
      }

      const quantity = extractQuantity(item, item.textContent) || 1;
      const finalPricePerItem = price / quantity;

      console.log('Product: ' + title.substring(0, 30) + ' | $' + price + ' | Qty: ' + quantity + ' | Per Item: $' + finalPricePerItem.toFixed(4));

      return {
        element: item,
        price: price,
        basePrice: price,
        shipping: 0,
        quantity: quantity,
        pricePerItem: finalPricePerItem,
        title: title
      };
    } catch (e) {
      console.error('Error analyzing product:', e);
      return null;
    }
  }

  function getProductSelector() {
    if (isAmazon) {
      return '[data-component-type="s-search-result"]';
    } else if (isAliexpress) {
      return 'a[href*="/item/"].search-card-item';
    } else if (isEbay) {
      return '.s-item';
    } else if (isTemu) {
      return '[data-tooltip^="goodContainer-"]';
    } else if (isWalmart) {
      return '[data-item-id]';
    }
    return '[class*="item"]';
  }

  function processProducts() {
    if (!isExtensionActive) return;
    
    console.log('Processing products on ' + siteName);
    
    const selector = getProductSelector();
    let productItems = document.querySelectorAll(selector);

    if (productItems.length === 0 && isWalmart) {
      console.log('Trying Walmart fallback selector...');
      const links = document.querySelectorAll('a[link-identifier]');
      console.log('Found ' + links.length + ' product links');
      
      if (links.length > 0) {
        const parents = [];
        for (let i = 0; i < links.length; i++) {
          let parent = links[i].parentElement;
          for (let j = 0; j < 3; j++) {
            if (parent && parent.parentElement) {
              parent = parent.parentElement;
            }
          }
          if (parent && parents.indexOf(parent) === -1) {
            parents.push(parent);
          }
        }
        productItems = parents;
        console.log('Using ' + productItems.length + ' parent containers');
      }
    }

    if (productItems.length === 0) {
      console.log('No products found');
      return;
    }
    
    console.log('Found ' + productItems.length + ' product items');

    const uniqueItems = [];
    
    for (let i = 0; i < productItems.length; i++) {
      const item = productItems[i];
      if (!processedElements.has(item)) {
        processedElements.add(item);
        uniqueItems.push(item);
      }
    }
    
    console.log('Processing ' + uniqueItems.length + ' unique products');

    for (let i = 0; i < uniqueItems.length; i++) {
      const product = analyzeProduct(uniqueItems[i]);
      if (product && isValidPrice(product.price) && isValidPrice(product.pricePerItem)) {
        allProducts.push(product);
      }
    }

    if (allProducts.length > 0) {
      let minPrice = allProducts[0].pricePerItem;
      for (let i = 1; i < allProducts.length; i++) {
        if (allProducts[i].pricePerItem < minPrice) {
          minPrice = allProducts[i].pricePerItem;
        }
      }
      
      bestDeals = [];
      for (let i = 0; i < allProducts.length; i++) {
        if (Math.abs(allProducts[i].pricePerItem - minPrice) < 0.0001) {
          bestDeals.push(allProducts[i]);
        }
      }
      
      for (let i = 0; i < allProducts.length; i++) {
        const isBest = bestDeals.indexOf(allProducts[i]) !== -1;
        addPriceBadge(allProducts[i], isBest);
      }
      
      console.log('Analyzed ' + allProducts.length + ' products, ' + bestDeals.length + ' best deals');
    }
  }

  function addPriceBadge(product, isBest) {
    if (product.element.querySelector('.price-per-item-badge')) {
      return;
    }

    const badge = document.createElement('div');
    badge.className = 'price-per-item-badge' + (isBest ? ' best-deal' : '');
    
    const bestLabel = isBest ? '<span class="best-label">BEST VALUE</span>' : '';
    
    badge.innerHTML = '<button class="badge-close-btn" title="Hide">×</button><div class="badge-content">' + bestLabel + '<span class="price-text">$' + product.pricePerItem.toFixed(4) + '/item</span><span class="quantity-text">Total: $' + product.basePrice.toFixed(2) + (product.quantity > 1 ? ' (' + product.quantity + ' pack)' : '') + '</span></div>';
    
    const closeBtn = badge.querySelector('.badge-close-btn');
    closeBtn.onclick = function(e) {
      e.stopPropagation();
      badge.style.display = 'none';
    };

    product.element.style.position = 'relative';
    product.element.insertBefore(badge, product.element.firstChild);
    
    if (isBest) {
      product.element.classList.add('best-deal-item');
    }
  }


  function scrollToProduct(product) {
    if (!product || !product.element) return;
    
    if (isTemu) {
      const rect = product.element.getBoundingClientRect();
      window.scrollTo({
        top: rect.top + window.scrollY - 120, 
        behavior: 'smooth'
      });
    } else {
      product.element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
    
    product.element.classList.add('flash-highlight');
    setTimeout(function() {
      product.element.classList.remove('flash-highlight');
    }, 2000);
  }
  
  function generateTopDealsList() {
    if (allProducts.length === 0) {
      return '<div class="no-deals">No deals found</div>';
    }
    
    const sorted = allProducts.slice().sort(function(a, b) {
      return a.pricePerItem - b.pricePerItem;
    }).slice(0, 3);
    
    const minPrice = sorted[0].pricePerItem;
    
    let html = '';
    for (let i = 0; i < sorted.length; i++) {
      const deal = sorted[i];
      const isBestDeal = Math.abs(deal.pricePerItem - minPrice) < 0.0001;
      const badge = isBestDeal ? '<div class="deal-badge">⭐</div>' : '';
      html += '<div class="deal-item" data-product-index="' + allProducts.indexOf(deal) + '"><div class="deal-rank">#' + (i + 1) + '</div><div class="deal-info"><div class="deal-title">' + deal.title + '</div><div class="deal-price"><strong>$' + deal.pricePerItem.toFixed(4) + '/item</strong><span class="deal-total">(' + deal.quantity + ' pack)</span></div></div>' + badge + '</div>';
    }
    return html;
  }

  function disableExtension() {
    console.log('Disabling extension...');
    isExtensionActive = false;
    
    const floatBtn = document.getElementById('price-finder-float-btn');
    if (floatBtn) floatBtn.remove();
    
    hideOverlay();
    
    const badges = document.querySelectorAll('.price-per-item-badge');
    for (let i = 0; i < badges.length; i++) {
      badges[i].remove();
    }
    
    const bestDealItems = document.querySelectorAll('.best-deal-item');
    for (let i = 0; i < bestDealItems.length; i++) {
      bestDealItems[i].classList.remove('best-deal-item');
    }
    
    processedElements = new WeakSet();
    allProducts = [];
    bestDeals = [];
  }

  function setupButtonDragging(button) {
    button.addEventListener('mousedown', function(e) {
      const startX = e.clientX;
      const startY = e.clientY;
      let hasMoved = false;
      
      isButtonDragging = true;
      
      const rect = button.getBoundingClientRect();
      buttonDragOffsetX = e.clientX - rect.left;
      buttonDragOffsetY = e.clientY - rect.top;
      
      button.style.cursor = 'grabbing';
      e.preventDefault();
      
      const mouseMoveHandler = function(moveEvent) {
        if (!isButtonDragging) return;
        
        const deltaX = Math.abs(moveEvent.clientX - startX);
        const deltaY = Math.abs(moveEvent.clientY - startY);
        if (deltaX > 5 || deltaY > 5) {
          hasMoved = true;
        }
        
        buttonX = moveEvent.clientX - buttonDragOffsetX;
        buttonY = moveEvent.clientY - buttonDragOffsetY;
        
        const maxX = window.innerWidth - button.offsetWidth;
        const maxY = window.innerHeight - button.offsetHeight;
        
        buttonX = Math.max(0, Math.min(buttonX, maxX));
        buttonY = Math.max(0, Math.min(buttonY, maxY));
        
        button.style.left = buttonX + 'px';
        button.style.top = buttonY + 'px';
        
        moveEvent.preventDefault();
      };
      
      const mouseUpHandler = function() {
        if (isButtonDragging) {
          isButtonDragging = false;
          button.style.cursor = 'grab';
          
          if (hasMoved) {
            button.addEventListener('click', function preventClick(e) {
              e.stopPropagation();
              e.preventDefault();
              button.removeEventListener('click', preventClick);
            }, { capture: true, once: true });
          }
        }
        
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
      
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    });
    
    button.style.cursor = 'grab';
  }

  function createFloatingButton() {
    if (document.getElementById('price-finder-float-btn')) return;

    const button = document.createElement('button');
    button.id = 'price-finder-float-btn';
    button.className = 'price-finder-float-btn';
    
    button.style.left = buttonX + 'px';
    button.style.top = buttonY + 'px';
    
    button.innerHTML = `
      <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
        <g transform="translate(3, 2)">
          <path d="M 6.5 14 
                   L 10.8 48.6 
                   Q 10.8 51.3 13.5 51.3
                   L 40.5 51.3
                   Q 43.2 51.3 43.2 48.6
                   L 47.5 14 Z" 
                fill="white" 
                opacity="0.98"
                stroke="white"
                stroke-width="1.5"/>
          
          <path d="M 16.2 14
                   Q 16.2 5.4 27 5.4
                   Q 37.8 5.4 37.8 14"
                fill="none" 
                stroke="white" 
                stroke-width="4.9"
                stroke-linecap="round"
                opacity="0.98"/>
          
          <text x="19.5" y="35" 
                font-family="Arial, sans-serif" 
                font-size="20" 
                font-weight="900" 
                fill="#667eea"
                text-anchor="middle"
                dominant-baseline="middle">÷</text>
          
          <text x="34.5" y="35" 
                font-family="Arial, sans-serif" 
                font-size="20" 
                font-weight="900" 
                fill="#764ba2"
                text-anchor="middle"
                dominant-baseline="middle">$</text>
        </g>
      </svg>
    `;
    button.title = 'Pack Saver - Drag to move, Single click to toggle, Double click to disable';
    
    let clickCount = 0;
    let clickTimer = null;
    
    button.onclick = function(e) {
      if (isButtonDragging) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      clickCount++;
      
      if (clickTimer) clearTimeout(clickTimer);
      
      if (clickCount === 1) {
        clickTimer = setTimeout(function() {
          if (isOverlayVisible) {
            hideOverlay();
          } else {
            showOverlay();
          }
          clickCount = 0;
        }, 300);
      } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        disableExtension();
        clickCount = 0;
      }
    };

    document.body.appendChild(button);
    setupButtonDragging(button);
  }

  function setupDragging(overlay) {
    const header = overlay.querySelector('#overlay-header');
    
    header.addEventListener('mousedown', function(e) {
      if (e.target.classList.contains('overlay-close') || 
          e.target.classList.contains('overlay-minimize')) {
        return;
      }
      
      isDragging = true;
      
      const rect = overlay.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      
      header.style.cursor = 'grabbing';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      overlayX = e.clientX - dragOffsetX;
      overlayY = e.clientY - dragOffsetY;
      
      const maxX = window.innerWidth - overlay.offsetWidth;
      const maxY = window.innerHeight - overlay.offsetHeight;
      
      overlayX = Math.max(0, Math.min(overlayX, maxX));
      overlayY = Math.max(0, Math.min(overlayY, maxY));
      
      overlay.style.left = overlayX + 'px';
      overlay.style.top = overlayY + 'px';
      
      e.preventDefault();
    });
    
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'move';
      }
    });
  }

  function createOverlay() {
    if (!isExtensionActive) return;
    
    const existing = document.getElementById('price-finder-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'price-finder-overlay';
    overlay.className = 'price-finder-overlay';
    
    overlay.style.left = overlayX + 'px';
    overlay.style.top = overlayY + 'px';
    
    const totalProducts = allProducts.length;
    
    let minPrice = totalProducts > 0 ? allProducts[0].pricePerItem : 0;
    for (let i = 1; i < allProducts.length; i++) {
      if (allProducts[i].pricePerItem < minPrice) {
        minPrice = allProducts[i].pricePerItem;
      }
    }
    
    const html = '<div class="overlay-header" id="overlay-header">' +
      '<div class="overlay-title"><span class="overlay-icon">📦</span><span>Pack Saver - ' + siteName + '</span></div>' +
      '<div class="overlay-controls">' +
      '<button class="overlay-minimize" id="minimize-overlay">_</button>' +
      '<button class="overlay-close" id="close-overlay">×</button>' +
      '</div>' +
      '</div>' +
      '<div class="overlay-content">' +
      '<div class="stats-grid">' +
      '<div class="stat-item"><div class="stat-value">' + totalProducts + '</div><div class="stat-label">Products</div></div>' +
      '<div class="stat-item highlight"><div class="stat-value">' + bestDeals.length + '</div><div class="stat-label">Best Deals</div></div>' +
      '<div class="stat-item"><div class="stat-value">$' + minPrice.toFixed(4) + '</div><div class="stat-label">Best $/Item</div></div>' +
      '</div>' +
      '<div class="overlay-actions">' +
      '<button class="action-btn primary" id="jump-to-best">🎯 Jump to Best Deal</button>' +
      '<button class="action-btn secondary" id="refresh-analysis">🔄 Refresh</button>' +
      '</div>' +
      '<div class="top-deals">' +
      '<div class="deals-header">Top 3 Deals:</div>' +
      generateTopDealsList() +
      '</div>' +
      '</div>';
    
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    setupDragging(overlay);

    overlay.querySelector('#close-overlay').onclick = disableExtension;
    
    overlay.querySelector('#minimize-overlay').onclick = function() {
      hideOverlay();
    };

    overlay.querySelector('#refresh-analysis').onclick = function() {
      processedElements = new WeakSet();
      allProducts = [];
      bestDeals = [];
      processProducts();
      createOverlay();
    };

    overlay.querySelector('#jump-to-best').onclick = function() {
      if (bestDeals.length > 0) {
        scrollToProduct(bestDeals[0]);
      }
    };

    const dealItems = overlay.querySelectorAll('.deal-item');
    for (let i = 0; i < dealItems.length; i++) {
      dealItems[i].onclick = function() {
        const productIndex = parseInt(this.getAttribute('data-product-index'));
        if (productIndex >= 0 && productIndex < allProducts.length) {
          scrollToProduct(allProducts[productIndex]);
        }
      };
    }

    isOverlayVisible = true;
  }

  function hideOverlay() {
    const overlay = document.getElementById('price-finder-overlay');
    if (overlay) overlay.remove();
    isOverlayVisible = false;
  }

  function showOverlay() {
    if (!isExtensionActive) return;
    if (!isOverlayVisible) createOverlay();
  }

  function startExtension() {
    if (!isExtensionActive) return;
    
    detectCurrency();
    console.log('Starting extension');
    
    processProducts();
    createFloatingButton();
    
    setTimeout(function() {
      if (!isExtensionActive) return;
      showOverlay();
      console.log('Overlay displayed');
      
      if (isAliexpress || isTemu) {
        console.log('Lazy-load site detected - starting auto-scroll to 9000px');
        
        setTimeout(function() {
          if (!isExtensionActive) return;
          console.log('Fast auto-scroll to 9000px (5s)...');
          fastAutoScrollToTriggerLazyLoad(9000);
          setTimeout(function() {
            processProducts();
            if (isOverlayVisible) createOverlay();
          }, 500);
        }, 5000);
        
      } else if (isAmazon || isWalmart) {
        console.log('Non-lazy-load site detected - setting up single refresh');
        
        setTimeout(function() {
          if (!isExtensionActive) return;
          console.log('Auto-refresh (15s)...');
          processProducts();
          if (isOverlayVisible) createOverlay();
        }, 15000);
      }
    }, 500);
    
    setupMutationObserver();
  }

  function fastAutoScrollToTriggerLazyLoad(targetY) {
    const currentY = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentY < targetY) {
      console.log('Fast scrolling to ' + targetY + 'px to trigger lazy-load');
      
      window.scrollTo({
        top: targetY,
        behavior: 'auto'
      });
      
      setTimeout(function() {
        window.scrollTo({
          top: 0,
          behavior: 'auto'
        });
        console.log('Instantly scrolled back to top');
      }, 800);
    }
  }

  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      if (!isExtensionActive) return;
      
      let shouldReprocess = false;
      
      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i];
        if (mutation.addedNodes.length > 0) {
          for (let j = 0; j < mutation.addedNodes.length; j++) {
            const node = mutation.addedNodes[j];
            if (node.nodeType === 1) {
              const selector = getProductSelector();
              if (node.matches && node.matches(selector)) {
                shouldReprocess = true;
                break;
              }
              if (node.querySelector && node.querySelector(selector)) {
                shouldReprocess = true;
                break;
              }
            }
          }
        }
        if (shouldReprocess) break;
      }
      
      if (shouldReprocess) {
        console.log('New products detected via mutation observer');
        clearTimeout(window.packSaverDebounce);
        window.packSaverDebounce = setTimeout(function() {
          processProducts();
          if (isOverlayVisible) createOverlay();
        }, 1000);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('Mutation observer active for lazy-load detection');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startExtension);
  } else {
    startExtension();
  }

})();

console.log('Extension loaded');