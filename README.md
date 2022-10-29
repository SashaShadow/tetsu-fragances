# RUTAS API.
## PRODUCTOS.

- GET (ALL) /api/products
- GET (ID) /api/products/:id
- GET (BY CATEGORY) /api/products/category/:category
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

## MENSAJES (chat general).

- GET (ALL) /api/mensajes
-  GET (BY ALIAS/USERNAME) /api/mensajes/:alias
- POST /api/mensajes

## MENSAJES (mensajeria con el admin)

- GET (ALL) /api/msgsto
- GET (BY ALIAS/USERNAME) /api/msgsto/:alias
- POST /api/msgsto

## CARRITOS
Al crearse un usuario se crea un carrito con el id del mismo en el campo "owner".
La id del carrito pasa a ser el numero de orden cuando se confirma la orden. 
Entonces el carrito se elimina y para crear uno nuevo el usuario debe agregar productos.

- GET (ALL) /api/cart
- GET (products of cart) /api/cart/:id/products
- POST (new cart) /api/cart
- POST (add product to cart) /api/cart/:id/products
- DELETE /api/cart/:id
- DELETE (product from cart) /api/cart/:id/products/:id_prod

## ORDENES
Su numero de orden es la id del carrito de donde provienen.

- GET (ALL) /api/orders
- POST (NEW ORDER) /api/orders

## MODELOS
Cabe aclarar que los modelos de estos anteriores elementos tienen un formato levemente distinto al planteado en las consignas.
Los mismos pueden verse en el archivo dbConfig.js de la carpeta dbmodels.

# TESTING
Están habilitados los tests de las rutas de productos. Para lo mismo hay que iniciar el servidor con el flag --t si o -TEST si. 
Esto hará que se utilice un DAO especial de productos para el testeo.
La mayor parte de las rutas están protegidas con JSON WEB TOKEN, sin embargo al iniciar el servidor en testeo, el jwt se deshabilitará,
pudiendo realizar las operaciones crud.
El resto de las rutas no tienen tests, pero se les desactiva el JWT.

# DESARROLLO O PRODUCCION
Además de la posibilidad de testing se podrá iniciar el servidor en modo desarrollo o produccion, pasando la variable de entorno
NODE_ENV antes de iniciar el servidor. Los valores posible son development y production.
El servidor inicia por defecto en produccion. Si se desea tener el servidor en desarrollo lo único que cambiará es la base de datos utilizada,
en este caso siendo mongodb pero local. Por defecto (produccion) se utiliza mongodb atlas.

# VISTAS
## PAGINA PRINCIPAL
La misma será /shop. Si el usuario no inició sesión se lo redirigirá a /shop/login. Si inicia sesión correctamente podrá visualizar la vista /shop,
donde estarán disponibles los productos para agregar al carrito, asi como el chat general.
Los productos podrán ser filtrados en esta vista con la ruta /shop/products/:category, siendo las categorias man, woman y unisex.

## CARRITO
En la ruta /shop/:userid el usuario podrá ver su carrito, confirmar la orden o eliminar productos del mismo.

## PERFIL
En la ruta /shop/profile el usuario podrá ver sus datos de registro, asi como links a vistas donde podrán ver sus ordenes generadas (/shop/orders) y los mensajes propios enviados al chat general (/shop/messages).




