import { EmailIcon, FacebookIcon, PinterestIcon, TwitterIcon, WhatsappIcon, } from "react-share";

const currentURL = window.location.href;

<div className="col-sm-12 col-lg-6 mt-4">
    <div className="social text-muted">
        Share On&nbsp;

        <FacebookShareButton
            url={currentURL}
            quote={"フェイスブックはタイトルが付けれるようです"}
            hashtag={"#hashtag"}
            description={"aiueo"}
            className="Demo__some-network__share-button"
        >
            <FacebookIcon size={24} round />
            &nbsp;
        </FacebookShareButton>

        <WhatsappShareButton
            url={currentURL}
            quote={"フェイスブックはタイトルが付けれるようです"}
            hashtag={"#hashtag"}
            description={"aiueo"}
            className="Demo__some-network__share-button"
        >
            <WhatsappIcon size={24} round />
            &nbsp;
        </WhatsappShareButton>
        <EmailShareButton
            url={currentURL}
            quote={"フェイスブックはタイトルが付けれるようです"}
            hashtag={"#hashtag"}
            description={"aiueo"}
            className="Demo__some-network__share-button"
        >
            <EmailIcon size={24} round />
            &nbsp;
        </EmailShareButton>

    </div>

</div>