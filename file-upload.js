// Gestion de l'upload de fichiers
document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('images');
  const fileLabel = document.querySelector('.file-label span');
  const fileCount = document.querySelector('.file-count');
  const fileList = document.querySelector('.file-list');
  const form = document.querySelector('.formulaire-devis');
  
  // Limite de taille en octets (10 Mo)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo
  const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10 Mo total
  
  // Stockage des fichiers sélectionnés
  let selectedFiles = [];
  
  // Gestion du changement de fichiers
  fileInput.addEventListener('change', function(e) {
      handleFileSelect(e.target.files);
  });
  
  // Fonction pour gérer la sélection de fichiers
  function handleFileSelect(files) {
      // Réinitialiser la liste
      selectedFiles = [];
      let totalSize = 0;
      let errors = [];
      
      // Vérifier chaque fichier
      Array.from(files).forEach(file => {
          // Vérifier le type
          if (!file.type.startsWith('image/')) {
              errors.push(`${file.name} n'est pas une image`);
              return;
          }
          
          // Vérifier la taille individuelle
          if (file.size > MAX_FILE_SIZE) {
              errors.push(`${file.name} dépasse 10 Mo`);
              return;
          }
          
          // Vérifier la taille totale
          if (totalSize + file.size > MAX_TOTAL_SIZE) {
              errors.push('La taille totale dépasse 10 Mo');
              return;
          }
          
          totalSize += file.size;
          selectedFiles.push(file);
      });
      
      // Afficher les erreurs s'il y en a
      if (errors.length > 0) {
          showError(errors.join('<br>'));
      }
      
      // Mettre à jour l'affichage
      updateFileDisplay();
  }
  
  // Fonction pour mettre à jour l'affichage des fichiers
  function updateFileDisplay() {
      // Mettre à jour le compteur
      if (selectedFiles.length === 0) {
          fileCount.textContent = 'Aucun fichier sélectionné';
          fileLabel.textContent = 'Choisir des images';
      } else {
          fileCount.textContent = `${selectedFiles.length} fichier${selectedFiles.length > 1 ? 's' : ''} sélectionné${selectedFiles.length > 1 ? 's' : ''}`;
          fileLabel.textContent = 'Modifier la sélection';
      }
      
      // Effacer la liste actuelle
      fileList.innerHTML = '';
      
      // Afficher chaque fichier
      selectedFiles.forEach((file, index) => {
          const fileItem = createFileItem(file, index);
          fileList.appendChild(fileItem);
      });
  }
  
  // Fonction pour créer un élément de fichier
  function createFileItem(file, index) {
      const div = document.createElement('div');
      div.className = 'file-item';
      
      const info = document.createElement('div');
      info.className = 'file-item-info';
      
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-image';
      
      const name = document.createElement('span');
      name.className = 'file-item-name';
      name.textContent = file.name;
      
      const size = document.createElement('span');
      size.className = 'file-item-size';
      size.textContent = formatFileSize(file.size);
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'file-remove';
      removeBtn.innerHTML = '×';
      removeBtn.onclick = () => removeFile(index);
      
      info.appendChild(icon);
      info.appendChild(name);
      info.appendChild(size);
      
      div.appendChild(info);
      div.appendChild(removeBtn);
      
      return div;
  }
  
  // Fonction pour supprimer un fichier
  function removeFile(index) {
      selectedFiles.splice(index, 1);
      
      // Mettre à jour l'input file
      const dt = new DataTransfer();
      selectedFiles.forEach(file => dt.items.add(file));
      fileInput.files = dt.files;
      
      updateFileDisplay();
  }
  
  // Fonction pour formater la taille du fichier
  function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Fonction pour afficher les erreurs
  function showError(message) {
      // Créer ou récupérer le conteneur d'erreur
      let errorDiv = document.querySelector('.file-error');
      if (!errorDiv) {
          errorDiv = document.createElement('div');
          errorDiv.className = 'file-error';
          document.querySelector('.file-upload-container').appendChild(errorDiv);
      }
      
      errorDiv.innerHTML = message;
      errorDiv.classList.add('show');
      
      // Masquer après 5 secondes
      setTimeout(() => {
          errorDiv.classList.remove('show');
      }, 5000);
  }
  
  // Gestion du drag & drop (optionnel)
  const dropZone = document.querySelector('.file-upload-container');
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
  });
  
  function highlight(e) {
      dropZone.classList.add('highlight');
  }
  
  function unhighlight(e) {
      dropZone.classList.remove('highlight');
  }
  
  dropZone.addEventListener('drop', handleDrop, false);
  
  function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      
      handleFileSelect(files);
  }
});

// Ajouter aussi à votre script.js ou inclure ce fichier séparément