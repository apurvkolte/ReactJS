// For hiding table in product details
const [r, setR] = useState('r');
const hide = () => {
    if (r === "r") {
        setR("p");
    } else {
        setR("r");
    }
}


<div className="row mt-2 mb-5">
    {productDetails.length ? (
        <table className="table table-bordered " id="Table_id">
            <thead>
                <tr>
                    <th scope="col" colSpan="2"> <h5 className="prod-heading">Product Specification </h5></th>
                </tr>
            </thead>
            <tbody>
                {productDetails.length &&
                    productDetails.map((field, i) => (
                        <tr className={`${r}${i + 1}`} id={i + 1}>
                            <td className="text-muted">{field.title}</td>
                            <td >{field.description}</td>
                        </tr>
                    ))}
                <tr>
                    <td colSpan="2" className="pt-2 pb-2" align="left"><a onClick={hide} className="text-muted">
                        {r === "r" ? (<div><small>SHOW MORE </small><b >&#8743;</b></div>) : (<div><small>SHOW LESS </small><b >&#8744;</b></div>)}</a></td>
                </tr>
            </tbody>
        </table>
    ) : ("")}
</div>


/*


.r1,
.r2,
.r3,
.r4,
.r5,
.r6 {
    display: "block";
}

.r7,
.r8,
.r9,
.r10,
.r11,
.r12,
.r12,
.r14,
.r15,
.r16,
.r17,
.r18,
.r19,
.r20,
.r21,
.r22,
.r23,
.r24,
.r25,
.r26,
.r27,
.r28,
.r29,
.r30,
.r32,
.r33,
.r34,
.r35,
.r36,
.r37,
.r38,
.r39,
.r40,
.r41,
.r42,
.r43,
.r44,
.r45,
.r46,
.r47,
.r48,
.r49,
.r50,
.r51,
.r52 {
    display: none!important;
}


* /
