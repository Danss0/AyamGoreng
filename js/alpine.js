document.addEventListener('alpine:init', () => {
Alpine.data('products', () => {
  return {
    items: [
      {id: 1, name: 'Ayam Bakar', price: 20000, img: 'bakar.jpg'},
      {id: 2, name: 'Ayam Goreng', price: 15000, img: 'goreng.jpeg'},
      {id: 3, name: 'Sate Kulit', price: 2000, img: 'kulit.jpg'}, 
    ],
  }});

  Alpine.store('cart', {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {

      const cartItem = this.items.find((item) => item.id === newItem.id);

      if(!cartItem) {
        this.items.push({...newItem, quantity: 1, total: newItem.price});
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {

      const cartItem = this.items.find((item) => item.id === id );

      if(cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          }  else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price
            return item;
          } 
        })
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});


//Form validasi
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disable = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function(){
  for(let i = 0; i < form.elements.length; i++) {
    if(form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove('disable');
      checkoutButton.classList.add('disable');
    } else {
      return false;
    }
  }
  checkoutButton.disable = false;
  checkoutButton.classList.remove('disable');
});


// kirim data ketika button diklik
checkoutButton.addEventListener('click', function(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData)
  window.open('http://wa.me/6285724464537?text=' + encodeURIComponent(message));

  // // transaksi token
  // try {
  //   const response = await fetch('php/placeOrder.php', {
  //     method: 'POST',
  //     body: data,
  //   });
  //   // const token = await response.text();
  //   window.snap.pay(token);
  // } catch (err) {
  //   console.log(err.message);
  // }
});


// format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Pelanggan
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
  Data Pesanan
  ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`)}
  TOTAL: ${rupiah(obj.total)}
  Terima kasih! ^^`;
};



// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
}