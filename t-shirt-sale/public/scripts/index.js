// DOM elements
const topLevelNavigation = document.querySelector('.top-level-navigation');
const secoundLevelNavigation = document.querySelector('.second-level-navigation');
const productShow = document.querySelector('.produkt');
const scrollOverview = document.querySelector('.produktOverView');


//Navigation
// Top Level Navigation Setup
function setupNavigation() {
  db.collection('series').get().then(snapshot =>{
    let html = '<h2>Motive</h2>';
    snapshot.docs.forEach(element => {
      const series = element.data();
      const li = `<a class="link" onclick="seriesChoise(${series.order})">${series.name}</a>`
      html += li;
    });
    topLevelNavigation.innerHTML = html;
  })
}

//Serie Auswahl 
function seriesChoise(nr) {
    db.collection('products').get().then(snapshot =>{
      let html = '<h3>Farbe</h3>';
      snapshot.docs.forEach(element =>{
        var produkt = element.data();
        if( produkt.series == nr){
          const li = `<a class="link" onclick="produktChoise(${nr},${produkt.productId})">${produkt.colour}</a>`  
          html += li;
        }
      })
      secoundLevelNavigation.innerHTML = html;
    })
    produktChoise(nr,0);
}

// Produkt Auswahl
function produktChoise(seriesId,productId) {
  scrollOverview.innerHTML = "";
  let html = '<table border=0 class="center" tyle="width:100%"><tr><th>';
  var price = 0;
  var name = "";
  db.collection('products').get().then(snapshot =>{
    snapshot.docs.forEach(element =>{
      var produkt = element.data();
      if( produkt.series == seriesId && produkt.productId == productId ){
        html1 = `<img src="img/products/${produkt.imgPath}" alt="Bild von einem T-Shirt" id="image">
                <h2>${produkt.name}</h2>
                <p>${produkt.material}</p>
                <p>${produkt.fit}</p>
                <p>${produkt.description}</p>
                <p>Preis: ${produkt.price}€</p>
                <label for="size">Größe wählen:</label>
                <select name="size" id="size">`

        var html2 = '';
        produkt.size.forEach(element =>{
           const option =   `<option value="${element}">${element}</option> `
           html2 += option;
                  })
          
          html3 =   `</select>
                  <p> Anzahl <input type="number" value="1" min="1" id ="number" name="number"></input></p>
                <div id="smart-button-container" style ="widght:20px">
                  <div style="text-align: center;">
                    <div class="paypal-button" id="paypal-button"></div>
                  </div>
                </di>`
        
        price = produkt.price;
        name = produkt.name;
        //Produktanzeige abschließen
        html += html1 + html2 + html3 +'</th>';//<th>test</th></tr></html>';
        let html4 = '<th><table>';
        db.collection('products').get().then(snapshot2 =>{
          snapshot2.docs.forEach(element =>{
            var produkt = element.data();
            if(seriesId == produkt.series){
              html4 += `<tr><th><button type="button" onclick="produktChoise(${seriesId},${produkt.productId})">${produkt.colour}</button></tr></th>`;
            }
          })
          html += html4 + '</table></th></tr></table>'
          productShow.innerHTML = html;
          initPayPalButton(name,price);
        })
      }
    })
  })
}

//Scroll view
function showAllProducts(){
  //Product Over view beginnen 
  let html = '<table style="width:50%" border = 0 class="center">';
  var price = 0;
  db.collection('products').get().then(snapshot =>{
    i = 0;
    snapshot.docs.forEach(element =>{
      var produkt = element.data();

      if ((i %3)  === 0){
        if (i != 0){
          html += `</tr>`;
        }
        html += `<tr>`;
      }
      html += `<th><img src="img/products/${produkt.imgPath}" onclick="produktChoise(${produkt.series},${produkt.productId})") alt="Bild von einem T-Shirt" id="image" ></th>`
      i += 1;
      var produkt = element.data();
    })
    //Product Overview beenden 
    html += '</table>'
    scrollOverview.innerHTML = html;
  })
}

//Bezahlung
//Paypal
function initPayPalButton(name,price,number) {
  paypal.Buttons({
    style: {
      shape: 'pill',
      color: 'blue',
      layout: 'vertical',
      label: 'buynow',
    },

    createOrder: function(data, actions) {
      var size = document.getElementById("size").value;
      var number = document.getElementById("number").value;
      return actions.order.create({
        purchase_units: [{"description":name +" "+size+" "+number,
                        "amount":{"currency_code":"EUR","value":price*number}}]
      });
    },

    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
       // console.log(details);
      // Bestellung in Firestore festhalten
        db.collection("order").doc().set({
          "create_time":details.create_time,
          "id":details.id,
          "intent":details.intent,
          "links":details.links,
          "payer":details.payer,
          "purchase_units":details.purchase_units,
          "status":details.status,
          "update_time":details.update_time,
        })
        .then(() => {
          alert("Vielen Dank"+details.payer.name.given_name +" "+details.payer.name.surname);
        })
        .catch((error) => {
         alert("Something went wrong")
        });
      });
    },

    onError: function(err) {
      console.log(err);
    }
  }).render('#paypal-button');
}


//Init der Seite für den ersten Aufruf
setupNavigation();
showAllProducts();