const container = document.querySelector("#contenedor");
const modalBody = document.querySelector(".modal .modal-body");
const containerShoppingCart = document.querySelector("#carritoContenedor");
const removeAllProductsCart = document.querySelector("#vaciarCarrito");
const keepBuy = document.querySelector("#procesarCompra");
const totalPrice = document.querySelector("#precioTotal");
const activeFunction = document.querySelector('#activarFuncion');
const fakeStoreApi = "https://fakestoreapi.com/products";

// Definir arreglos para guardar los productos y el carrito
let shoppingCart = [];
let productList = [];

// Agregar un manejador de eventos para el botón de filtrar
document.getElementById("filterButton").addEventListener("click", () => {
  const selectedCategory = document.getElementById("categorySelect").value;
  showProductsByCategory(selectedCategory);
});

// Función para mostrar productos por categoría
const showProductsByCategory = (category) => {
  const filteredProducts = productList.filter((product) => {
    if (category === "") {
      return true; // Mostrar todos los productos si no se selecciona ninguna categoría
    }

    if (category === "ropaHombre") {
      return product.category === "men's clothing";
    }

    if (category === "ropaMujer") {
      return product.category === "women's clothing";
    }

    return product.category === category;
  });

  container.innerHTML = ""; // Limpiar el contenido actual
  filteredProducts.forEach(addProductsContainer);
};

// Solicitar y agregar productos al contenedor
const fetchProducts = async () => {
  try {
    const response = await fetch(fakeStoreApi);
    if (!response.ok) {
      throw new Error("No se pudo conectar");
    }

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
};

const addProductsContainer = (product) => {
  const { id, title, image, price, description } = product;
  container.innerHTML += `
    <div class="card mt-3" style="width: 13rem;">
      <img class="card-img-top mt-2" src="${image}" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text" style="font-weight: bold">$ ${price}</p>
        <p class="card-text">• ${description}</p>
        <button class="btn btn-primary" onclick="addProductToCart(${id})">Comprar producto</button>
      </div>
    </div>
  `;
};

const getProducts = async () => {
  const products = await fetchProducts();
  console.table(products);
  products.forEach(addProductsContainer);

  productList = products;
};

// Agregar productos al carrito
const addProductToCart = (id) => {
  const testProductId = shoppingCart.some((item) => item.id === id);

  if (testProductId) {
    Swal.fire({
      title: "Este producto ya fue seleccionado",
      text: "Por favor seleccione otro",
      icon: "success",
    });
    return;
  }

  shoppingCart.push({
    ...productList.find((item) => item.id === id),
    quantity: 1,
  });

  showShoppingCart();
};

// Mostrar carrito de compras
const showShoppingCart = () => {
  modalBody.innerHTML = "";

  shoppingCart.forEach((product) => {
    const { title, image, price, id } = product;

    modalBody.innerHTML += `
      <div class="modal-contenedor">
        <div>
          <img class="img-fluid img-carrito" src="${image}"/>
        </div>
        <div>
          <p style="font-weight: bold">${title}</p>
          <p style="font-weight: bold">Precio: R$ ${price}</p>
          <div>
            <button onclick="removeProductFromCart(${id})" class="btn btn-danger">Eliminar producto</button>
          </div>
        </div>
      </div>
    `;
  });

  totalPriceInCart(totalPrice);
  messageEmptyShoppingCart();
  containerShoppingCart.textContent = shoppingCart.length;
  setItemInLocalStorage();
};

// Quitar productos del carrito
const removeProductFromCart = (id) => {
  const index = shoppingCart.findIndex((item) => item.id === id);

  if (index !== -1) {
    shoppingCart.splice(index, 1);
    showShoppingCart();
  }
};

// Vaciar carrito de compras
removeAllProductsCart.addEventListener("click", () => {
  shoppingCart.length = 0;
  showShoppingCart();
});

// Mensaje de carrito vacío
const messageEmptyShoppingCart = () => {
  if (shoppingCart.length === 0) {
    modalBody.innerHTML = `
      <p class="text-center text-primary parrafo">No hay nada en el carrito!</p>
    `;
  }
};

// Continuar comprando
keepBuy.addEventListener("click", () => {
  if (shoppingCart.length === 0) {
    Swal.fire({
      title: "Su carrito está vacío",
      text: "Compre algo para continuar",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  } else {
    location.href = "index.html";
    finalOrder();
  }
});

// Precio total en el carrito
const totalPriceInCart = (totalPriceCart) => {
  totalPriceCart.innerText = shoppingCart.reduce((acc, prod) => {
    return acc + prod.price;
  }, 0);
};

// Almacenamiento local
const setItemInLocalStorage = () => {
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
};

const addItemInLocalStorage = () => {
  shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  setItemInLocalStorage();
  showShoppingCart();
};

document.addEventListener("DOMContentLoaded", addItemInLocalStorage);
getProducts();

// Agrega un botón para ordenar los resultados
const sortButton = document.createElement("button");
sortButton.textContent = "Ordenar Descendente";
sortButton.classList.add("btn", "btn-secondary", "mt-3");
sortButton.addEventListener("click", () => {
  fetch("https://fakestoreapi.com/products?sort=desc")
    .then((res) => res.json())
    .then((json) => {
      container.innerHTML = ""; // Limpia el contenedor actual
      json.forEach(addProductsContainer); // Agrega los productos ordenados al contenedor
    });
});

// Agrega el botón de ordenar al DOM
document.addEventListener("DOMContentLoaded", addItemInLocalStorage);
getProducts();

// Función para agregar un nuevo producto
const agregarNuevoProducto = () => {
  fetch('https://fakestoreapi.com/products', {
      method: "POST",
      body: JSON.stringify({
          title: 'Nuevo Producto',
          price: 99.99,
          description: 'Descripción del nuevo producto',
          image: 'https://via.placeholder.com/150', // URL de la imagen del producto
          category: 'electronic' // Categoría del producto
      }),
      headers: {
          'Content-Type': 'application/json'
      }
  })
      .then(response => response.json())
      .then(nuevoProducto => {
          console.log('Nuevo producto agregado:', nuevoProducto);
          // Puedes realizar cualquier acción adicional aquí, como mostrar el nuevo producto en la página.
          // Por ejemplo, podrías agregarlo a la lista de productos existente y volver a mostrarlos.
          productList.push(nuevoProducto);
          showProductsByCategory(""); // Muestra todos los productos nuevamente (opcional).
      })
      .catch(error => {
          console.error('Error al agregar el nuevo producto:', error);
      });
};

// Actualizar producto
// Función para actualizar un producto
const updateProduct = () => {
  // Captura el ID del producto desde el campo de entrada
  const productId = document.getElementById("updateProductId").value;

  // Busca el producto en la lista de productos por su ID
  const productToUpdate = productList.find((product) => product.id === parseInt(productId));

  // Verifica si el producto existe
  if (!productToUpdate) {
    Swal.fire({
      title: "Producto no encontrado",
      text: "No se encontró ningún producto con este ID.",
      icon: "error",
    });
    return;
  }

  // Obtiene los nuevos valores de precio y descripción
  const newPrice = document.getElementById("updateProductPrice").value;
  const newDescription = document.getElementById("updateProductDescription").value;

  // Actualiza el producto con los nuevos valores
  productToUpdate.price = parseFloat(newPrice);
  productToUpdate.description = newDescription;

  // Muestra un mensaje de éxito
  Swal.fire({
    title: "Producto Actualizado",
    text: "El producto ha sido actualizado correctamente.",
    icon: "success",
  });

  // Puedes realizar cualquier acción adicional aquí, como volver a mostrar los productos actualizados.
  // Por ejemplo, podrías llamar a la función showProductsByCategory() para actualizar la lista de productos en la página.
  showProductsByCategory("");
};

// Agregar un manejador de eventos para el botón de actualización
document.getElementById("updateProductButton").addEventListener("click", updateProduct);


// Eliminar producto
// Función para eliminar un producto
const deleteProduct = () => {
  // Captura el ID del producto desde el campo de entrada
  const productId = document.getElementById("deleteProductId").value;

  // Convierte el ID a un número entero
  const productIdToDelete = parseInt(productId);

  // Busca el índice del producto en la lista de productos por su ID
  const index = productList.findIndex((product) => product.id === productIdToDelete);

  // Verifica si el producto existe
  if (index === -1) {
    Swal.fire({
      title: "Producto no encontrado",
      text: "No se encontró ningún producto con este ID.",
      icon: "error",
    });
    return;
  }

  // Elimina el producto de la lista
  productList.splice(index, 1);

  // Muestra un mensaje de éxito
  Swal.fire({
    title: "Producto Eliminado",
    text: "El producto ha sido eliminado correctamente.",
    icon: "success",
  });

  // Realiza cualquier acción adicional, como volver a mostrar la lista de productos actualizada.
  // Por ejemplo, podrías llamar a la función showProductsByCategory() para actualizar la lista de productos en la página.
  showProductsByCategory("");
};

// Agregar un manejador de eventos para el botón de eliminación
document.getElementById("deleteProductButton").addEventListener("click", deleteProduct);



// Agrega un manejador de eventos al botón para ordenar productos de nuevo
document.getElementById("sortDescendingButton").addEventListener("click", async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products?sort=desc');
    if (!response.ok) {
      throw new Error('No se pudo conectar');
    }
    const products = await response.json();
    console.table(products);

    container.innerHTML = ""; // Limpia el contenido actual
    products.forEach(addProductsContainer); // Agrega los productos ordenados al contenedor
  } catch (error) {
    console.log(error.message);
  }
});

// Agregar un manejador de eventos para el botón de eliminar producto
document.getElementById("deleteProductButton").addEventListener("click", deleteProduct);





// Agrega un manejador de eventos para un botón o acción que desencadene la adición de un nuevo producto.
document.getElementById("agregarProductoButton").addEventListener("click", agregarNuevoProducto);
