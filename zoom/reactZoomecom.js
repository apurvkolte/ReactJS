function zoom(e) {
    const zoomer = e.currentTarget;
    const rect = zoomer.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    zoomer.style.backgroundPosition = `${x}% ${y}%`;
}


<figure className="prod_details_img bg-white zoom" style={{ backgroundImage: `url('http://localhost:3000/uploads/product/${previewImg}')` }}
    onMouseMove={(event) => zoom(event)} >
    <img src={`/uploads/product/${previewImg}`} alt="product-img" />
</figure>




// figure.zoom {
//   position: relative;
//   width: 500px;
//   overflow: hidden;
//   cursor: zoom-in;
//   background-repeat: no-repeat;
//   background-size: 200%;
//   background-position: center;
// }

// figure.zoom img {
//   width: 100%;
//   display: block;
//   transition: opacity 0.4s;
//   pointer-events: none;
//   /* KEY FIX */
// }

// figure.zoom:hover img {
//   opacity: 0;
// }