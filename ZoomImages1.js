
function zoom(e) {
    var zoomer = e.currentTarget;
    let pageX;
    let pageY
    let x
    let y
    e.pageX ? (pageX = e.pageX) : (pageX = e.clientX);
    e.pageY ? (pageY = e.pageY) : (pageX = e.clientY);
    x = (pageX / zoomer.offsetWidth) * 70
    y = (pageY / zoomer.offsetHeight) * 50
    zoomer.style.backgroundPosition = x + "% " + y + "%";
}





// figure.zoom {
//     & img:hover {
//       opacity: 0;
//     }

//     img {
//       transition: opacity 0.5s;
//       display: block;
//       width: 100%;
//     }

//     background-position: 50% 50%;
//     position: relative;
//     width: 500px;
//     overflow: hidden;
//     cursor: zoom-in;
//   }




<figure
    className="zoom"
    style={{ backgroundImage: "url('https://res.cloudinary.com/active-bridge/image/upload/slide1.jpg')" }}
    onMouseMove={(event) => zoom(event)}
>
    <img
        src="https://res.cloudinary.com/active-bridge/image/upload/slide1.jpg"
    />
</figure>