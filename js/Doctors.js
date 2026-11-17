document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('search');
  const filterSpecialty = document.getElementById('filterSpecialty');
  const filterExp = document.getElementById('filterExp');
  const filterService = document.getElementById('filterService');
  const doctorItems = document.querySelectorAll('.doctor-item');
  const bookButtons = document.querySelectorAll('.btn-book');

  function filterDoctors() {
    const query = search.value.toLowerCase();
    const specialty = filterSpecialty.value;
    const exp = filterExp.value;
    const service = filterService.value;

    doctorItems.forEach(card => {
      const name = card.querySelector('h6').innerText.toLowerCase();
      const cardSpecialty = card.dataset.specialty;
      const cardExp = parseInt(card.dataset.exp);
      const cardService = card.dataset.service;

      const matchSearch = name.includes(query);
      const matchSpecialty = specialty === 'all' || cardSpecialty === specialty;
      const matchService = service === 'all' || cardService === service;
      const matchExp = exp === 'all' || cardExp >= parseInt(exp);

      if (matchSearch && matchSpecialty && matchService && matchExp) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  
  search.addEventListener('input', filterDoctors);
  filterSpecialty.addEventListener('change', filterDoctors);
  filterExp.addEventListener('change', filterDoctors);
  filterService.addEventListener('change', filterDoctors);

  bookButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const doctor = btn.dataset.doctor;
      const service = btn.dataset.service;

      localStorage.setItem('selectedDoctor', doctor);
      localStorage.setItem('selectedService', service);

      window.location.href = `booking.html?doctor=${
        encodeURIComponent(doctor)
    }
    &service=${
        encodeURIComponent(service)
    }`;
    });
  });

  console.log('Beauty Clinic - Doctors page loaded. Total doctors:', doctorItems.length);
});