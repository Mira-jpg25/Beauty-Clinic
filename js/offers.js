const filterButtons = document.querySelectorAll('.filter-btn');
const offerItems = document.querySelectorAll('.offer-item');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {

    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.filter;

    offerItems.forEach(item => {
      if (cat === 'all' || item.dataset.cat === cat) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// لو جاي من لينك فيه offer
const params = new URLSearchParams(window.location.search);
if (params.get('offer')) {
  console.log('Selected offer:', params.get('offer'));
}