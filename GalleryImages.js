import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'

// const options = {
//     arrowPrev: true,
//     arrowNext: true,
//     zoom: true,
//     close: true,
//     counter: true,
//     // bgOpacity: 0.2,
//     padding: { top: 20, bottom: 40, left: 100, right: 100 },
// }


< Gallery options={options} >
    <Item
        original={`/images/advertise/${adv.image}`}
        thumbnail={`/images/advertise/${adv.image}`}
        width="724"
        height="568"
    >
        {({ ref, open }) => (
            <img ref={ref} onClick={open} src={`/images/advertise/${adv.image}`} height={70} width={70} />

        )}
    </Item>

    <Item
        original={`/images/advertise/${adv.image}`}
        thumbnail={`/images/advertise/${adv.image}`}
        width="724"
        height="568"
    >
        {({ ref, open }) => (
            <img ref={ref} onClick={open} src={`/images/advertise/${adv.image}`} height={70} width={70} />

        )}
    </Item>
</ >