window.onload = function () {
  const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
  const container = document.getElementById('liste-favoris');

  if (favoris.length === 0) {
    container.innerHTML = "<p>Vous n'avez aucun favori.</p>";
    return;
  }

  favoris.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('favori-item');

    div.innerHTML = `
      <h3>${item.nom}</h3>
      <p>${item.description}</p>
      <button onclick="supprimerFavori('${item.id}')">Supprimer</button>
    `;

    container.appendChild(div);
  });
};

function supprimerFavori(id) {
  let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
  favoris = favoris.filter(item => item.id !== id);
  localStorage.setItem('favoris', JSON.stringify(favoris));
  location.reload(); // recharge la page pour voir le changement
}
