import { Gallery, Item } from 'react-photoswipe-gallery'


<Gallery>
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
</Gallery>