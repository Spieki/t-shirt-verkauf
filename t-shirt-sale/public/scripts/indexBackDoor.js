// DOM elements
const guideList = document.querySelector('.order');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const shoppingCard = document.querySelector('.shoppingCard');

//show menu on stage if loggin oder loggedout
const setupUI = (user) =>{
  if (user){
    // toogle UI elemts
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  }else{
    // toogle UI elemts
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
}



// setup product List for Login User
const setupOrderList= (data) => {
    let html = '<caption><h5>Bestellungen</h5></caption>';
    html += '<tr><th>ID</th><th>Datum</th><th>Käufer</th><th>Lieferadresse</th><th>Produkt</th><th>Preis</th><th>Kontrolle</th></tr>';

   
    data.forEach(doc => {
      const order = doc.data();
      const li = `
        <tr>
          <th>${JSON.stringify(order.id)}</th>
          <th>${JSON.stringify(order.create_time)}</th>
          <th>${JSON.stringify(order.payer.name)}</th>
          <th>${JSON.stringify(order.purchase_units[0].shipping.address)}<br>${JSON.stringify(order.purchase_units[0].shipping.name)} </th>
          <th>${JSON.stringify(order.purchase_units[0].description)}</th>
          <th>${JSON.stringify(order.purchase_units[0].amount.value)} </th>
          <th>${JSON.stringify(order.status)}</th>
        </tr>
      `;
      html += li;
    });
  guideList.innerHTML = html
}


// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});