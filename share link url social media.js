import React from 'react'

const share = () => {
    const [currentURL, setCurrentURL] = useState("");
    const [showCopyToast, setShowCopyToast] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentURL(window.location.href);
        }
    }, []);


    const handleCopyLink = () => {
        if (navigator.clipboard && currentURL) {
            navigator.clipboard.writeText(currentURL).then(() => {
                setShowCopyToast(true);
                setTimeout(() => setShowCopyToast(false), 3000);
            });
        }
    }

    const handleNativeShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: product_user?.name || "",
                    text: "I just viewed this business listing and found it very useful.",
                    url: currentURL,
                });
                updateShare();
            } catch (error) {
                // User cancelled or error occurred
                console.log('Sharing cancelled or failed:', error);
            }
        }
    }


    return (
        <div>
            <li className="list-inline-item">
                <a href="#" onClick={handleNativeShare} title="Share" >
                    <i className="fa fa-share-alt fa-lg"></i>
                </a>
            </li>
            <li className="list-inline-item">
                <a href="#" onClick={handleCopyLink} title="Copy link">
                    <i className="fa fa-link fa-lg"></i>
                </a>
            </li>
        </div>
    )
}

export default share