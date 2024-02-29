let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];
let totalAmount = document.querySelector('.totalAmount');

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

    const addDataToHTML = () => {
    // remove datas default from HTML

        // add new datas
        if(products.length > 0) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="" width="150px" height="250px">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    }
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();

        //  total
const total = () => {
    let totalPrice = 0;
    let discount = 0;
    cart.forEach(item => {
        let positionProduct = products.findIndex((value) => value.id == item.product_id);
        let info = products[positionProduct];
        totalPrice += info.price * item.quantity;
    });
    if(totalAmount<5000){
        discount = 0*totalPrice;
    }
    else if (totalPrice >= 5000 && totalPrice < 10000) {
        discount = 0.05 * totalPrice;
    } else if (totalPrice >= 10000 && totalPrice < 20000) {
        discount = 0.07 * totalPrice;
    } else if (totalPrice > 20000) {
        discount = 0.10 * totalPrice;
    }

    let discountedPrice = totalPrice - discount;

    totalAmount.innerHTML = `Total : $ ${totalPrice.toFixed(2)}`;
    totalAmount.style.fontSize = '1em';
    totalAmount.style.marginLeft = '20px';

    if (discount > 0) {
        totalAmount.innerHTML += `<br>Discount : $ ${discount.toFixed(2)}`;
    }else{
        totalAmount.innerHTML += `<br>Discount : $ ${discount.toFixed(2)}`;
    }

    totalAmount.innerHTML += `<br>Total After Discount : $ ${discountedPrice.toFixed(2)}`;

}

    // checkout

const checkOut = () => {
    const name = prompt("Enter your name:");
    const mobNo = prompt("Enter Your Mobile Number:");
    const address = prompt("Enter your address:");
    const date = prompt("Enter Date:");
    
    // Create invoice HTML
    let invoiceHTML = `
        <h2 style="color:blue">Fashion Shoppy<h2>
        <h3>Invoice</h3>
        <p style="text-align:left">GSTIN: 07AEFBD8343283<P>
        <p style="text-align:left"><strong>Name:</strong> ${name}</p>
        <p style="text-align:left"><strong>Address:</strong> ${address}</p>
        <table >
            <thead style="border-top:1px solid; border-bottom:1px solid">
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody style="border-bottom:1px solid">
    `;

    // Add cart items to invoice
    cart.forEach(item => {
        let positionProduct = products.findIndex((value) => value.id == item.product_id);
        let info = products[positionProduct];
        invoiceHTML += `
            <tr>
                <td>${info.name}</td>
                <td>${item.quantity}</td>
                <td>${info.price.toFixed(2)}</td>
                <td>${(info.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
    });

    // Calculate total
    let totalPrice = 0;
    cart.forEach(item => {
        let positionProduct = products.findIndex((value) => value.id == item.product_id);
        let info = products[positionProduct];
        totalPrice += info.price * item.quantity;
    });

    let discount = 0;
    if(totalPrice<5000){
        discount = 0*totalPrice;
    }
    else if (totalPrice >= 5000 && totalPrice < 10000) {
        discount = 0.05 * totalPrice;
    } else if (totalPrice >= 10000 && totalPrice < 20000) {
        discount = 0.07 * totalPrice;
    } else if (totalPrice > 20000) {
        discount = 0.10 * totalPrice;
    }

    let discountedPrice = totalPrice - discount;

    // Add total to invoice
    invoiceHTML += `
            </tbody>
        </table>
        <p style="text-align:right; margin-bottom:-2px">SubTotal: ${totalPrice.toFixed(2)}</p>
        <p style="text-align:right;margin-bottom:-2px">Discount: ${discount.toFixed(2)}</p>
        <p style="text-align:right">Total : $${discountedPrice.toFixed(2)}</p>
    `;

    // Display invoice
    document.getElementById('invoice').innerHTML = invoiceHTML;
    printBill(name,mobNo, address, date);
};


    // print Pdf

const printBill = (name, mobNo, address, date) => {
    let serialNo = 1;
    const invoiceNumber = Math.floor(Math.random()*1000);
    // Create invoice HTML
    let invoiceHTML = `
         <div class="row">
         <div class="col">
         <h2 style="color:blue; font-size:40px">Fashion Shoppy</h2>
         <p>Shop No. 35, Sapna Sangeeta Rd,<br> Sapna Sangeeta, Inox, Patel Nagar,<br> Navlakha, Indore, <br>Madhya Pradesh 452001</p>
         </div>
         <div class="col">
        <p style="text-align:right; font-size:35px">Invoice </p>
        <p style="text-align:right">Invoice No: ${invoiceNumber}</p>
        <p style="text-align:right">GSTIN: 07AEFBD8343283</p>
        <p style="text-align:right">Date: ${date}</p>
         </div>
         </div>
        
        
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile No:</strong> ${mobNo}</p>
        <p><strong>Address:</strong> ${address}</p>
        <table style="width:800px">
            <thead style="border-top:1px solid ; border-bottom:1px solid">
                <tr>
                    <th>SNo</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody style="border-bottom:1px solid">
    `;

    let totalPrice = 0;
    cart.forEach(item => {
        let positionProduct = products.findIndex((value) => value.id == item.product_id);
        let info = products[positionProduct];
        invoiceHTML += `
            <tr>
                <td>${serialNo}.</td>
                <td>${info.name}</td>
                <td>${item.quantity}</td>
                <td>$${info.price.toFixed(2)}</td>
                <td>$${(info.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
        totalPrice += info.price * item.quantity;
        serialNo++;
    });

    let discount = 0;
    if (totalPrice < 5000) {
        discount = 0;
    } else if (totalPrice >= 5000 && totalPrice < 10000) {
        discount = 0.05 * totalPrice;
    } else if (totalPrice >= 10000 && totalPrice < 20000) {
        discount = 0.07 * totalPrice;
    } else if (totalPrice >= 20000) {
        discount = 0.10 * totalPrice;
    }

    let discountedPrice = totalPrice - discount;
    
    let cgst = 0;
    let sgst = 0;
    cgst = discountedPrice*0.09;
    sgst = discountedPrice*0.09;
    let tax = cgst+sgst;
    let netAmount = discountedPrice+tax;


    // Add total to invoice
    invoiceHTML += `
            </tbody>
        </table>
        <p style="text-align:right; margin-top:10px">SubAmount: $${totalPrice.toFixed(2)}</p>
        <p style="text-align:right; ">Discount: $${discount.toFixed(2)}</p>
        <p style="text-align:right;  border-bottom:1px solid">Amount: $${discountedPrice.toFixed(2)}</p>
        <p style="text-align:right;">CGST(9%): $${cgst.toFixed(2)}</p>
        <p style="text-align:right; border-bottom:1px solid">SGST(9%): $${sgst.toFixed(2)}</p>
        <p style="text-align:right; border-bottom:1px solid">NetAmount: $${netAmount.toFixed(2)}</p>
        <h3 style="text-align:center; font-family:cursive">THANK YOU</h3>
    `;

    // Generate PDF from the invoice HTML using html2pdf
    //html2pdf().from(invoiceHTML).save();
    // Generate PDF from the invoice HTML using html2pdf
html2pdf().from(invoiceHTML).set({ margin: [20, 10] }).save();

};











// print pdf but not showing a data
// const printBill = (name, address, date) => {
//     // Create invoice HTML
//     let invoiceHTML = `
//         <h2 style="color:blue">Fashion Shoppy</h2>
//         <h3>Invoice</h3>
//         <p style="text-align:left">GSTIN: 07AEFBD8343283</p>
//         <p style="text-align:left"><strong>Name:</strong> ${name}</p>
//         <p style="text-align:left"><strong>Address:</strong> ${address}</p>
//         <table>
//             <thead style="border-top:1px solid; border-bottom:1px solid">
//                 <tr>
//                     <th>Product</th>
//                     <th>Quantity</th>
//                     <th>Price</th>
//                     <th>Total</th>
//                 </tr>
//             </thead>
//             <tbody style="border-bottom:1px solid">
//     `;

//     cart.forEach(item => {
//         let positionProduct = products.findIndex((value) => value.id == item.product_id);
//         let info = products[positionProduct];
//         invoiceHTML += `
//             <tr>
//                 <td>${info.name}</td>
//                 <td>${item.quantity}</td>
//                 <td>$${info.price.toFixed(2)}</td>
//                 <td>$${(info.price * item.quantity).toFixed(2)}</td>
//             </tr>
//         `;
//     });

//     let totalPrice = cart.reduce((acc, item) => {
//         let positionProduct = products.findIndex((value) => value.id == item.product_id);
//         let info = products[positionProduct];
//         return acc + info.price * item.quantity;
//     }, 0);

//     let discount = 0;
//     if (totalPrice < 5000) {
//         discount = 0;
//     } else if (totalPrice >= 5000 && totalPrice < 10000) {
//         discount = 0.05 * totalPrice;
//     } else if (totalPrice >= 10000 && totalPrice < 20000) {
//         discount = 0.07 * totalPrice;
//     } else if (totalPrice >= 20000) {
//         discount = 0.10 * totalPrice;
//     }

//     let discountedPrice = totalPrice - discount;

//     // Add total to invoice
//     invoiceHTML += `
//             </tbody>
//         </table>
//         <p style="text-align:right; margin-bottom:-2px">SubTotal: ${totalPrice.toFixed(2)}</p>
//         <p style="text-align:right;margin-bottom:-2px">Discount: ${discount.toFixed(2)}</p>
//         <p style="text-align:right">Total : $${discountedPrice.toFixed(2)}</p>
//     `;

//     // Create a div element to hold the invoice HTML
//     const div = document.createElement('div');
//     div.innerHTML = invoiceHTML;

//     // Generate PDF from the invoice HTML using html2pdf
//     html2pdf(div, {
//         margin: 10,
//         filename: 'invoice.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//     });
// };









// const printBill = (name, address, date) => {
//     // Generate PDF content
//     let content = `
//         <h1 style="color:blue">Fashion Shoppy</h1>
//         <p>Shop No. 35, Sapna Sangeeta Rd,<br> Sapna Sangeeta, Inox, Patel Nagar,<br> Navlakha, Indore, <br>Madhya Pradesh 452001</p>
//         <h3 style="text-align:right; margin-top:-20px">Invoice </h3>
//         <p style="text-align:right">Invoice No [100]</p>
//         <p style="text-align:right">GSTIN: 07AEFBD8343283</p>
//         <p style="text-align:right">Date: ${date}</p>
//         <p>Name: ${name}</p>
//         <p>Address: ${address}</p>
//         <table>
//             <thead style="border-top:1px solid; border-bottom:1px solid">
//                 <tr>
//                     <th>Product</th>
//                     <th>Quantity</th>
//                     <th>Price</th>
//                     <th>Total</th>
//                 </tr>
//             </thead>
//             <tbody style="border-bottom:1px solid">
//     `;

//     cart.forEach(item => {
//         let positionProduct = products.findIndex((value) => value.id == item.product_id);
//         let info = products[positionProduct];
//         content += `
//             <tr>
//                 <td>${info.name}</td>
//                 <td>${item.quantity}</td>
//                 <td>$${info.price.toFixed(2)}</td>
//                 <td>$${(info.price * item.quantity).toFixed(2)}</td>
//             </tr>
//         `;
//     });

//     let totalPrice = cart.reduce((acc, item) => {
//         let positionProduct = products.findIndex((value) => value.id == item.product_id);
//         let info = products[positionProduct];
//         return acc + info.price * item.quantity;
//     }, 0);

//     let discount = 0;
//     if (totalPrice < 5000) {
//         discount = 0;
//     } else if (totalPrice >= 5000 && totalPrice < 10000) {
//         discount = 0.05 * totalPrice;
//     } else if (totalPrice >= 10000 && totalPrice < 20000) {
//         discount = 0.07 * totalPrice;
//     } else if (totalPrice >= 20000) {
//         discount = 0.10 * totalPrice;
//     }

//     let discountedPrice = totalPrice - discount;

//     content += `
//             </tbody>
//         </table>
//         <p style="text-align:right">SubTotal: $${totalPrice.toFixed(2)}</p>
//         <p style="text-align:right">Discount: $${discount.toFixed(2)}</p>
//         <p style="text-align:right">Total: $${discountedPrice.toFixed(2)}</p>
//         <h4 style="font-family:cursive; text-align:center">THANK YOU</h4>
//     `;

//     // Create a Blob object
//     const blob = new Blob([content], { type: 'application/pdf' });

//     // Create a URL for the Blob
//     const url = URL.createObjectURL(blob);

//     // Create a hidden link element
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     a.download = 'invoice.pdf';

//     // Append the link to the body and click it to trigger download
//     document.body.appendChild(a);
//     a.click();

//     // Clean up
//     URL.revokeObjectURL(url);
//     document.body.removeChild(a);
// };




















 




