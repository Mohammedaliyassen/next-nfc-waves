
import './footer.css'


function Footer() {
    return (
        <>
            <div className="footer container">
                <div className="row">
                    <div className="footerContent col-12 col-lg-8 d-flex justify-content-around border-end">
                        <div className="about  d-flex flex-column">
                            <h2>ABOUT</h2>
                            <a href="https://waves.pockethost.io/" target='_blank' rel='noreferrer' className="p text-white">connect us</a>
                            <a href="https://waves.pockethost.io/" target='_blank' rel='noreferrer' className="p text-white">about us</a>
                            <a href="https://waves.pockethost.io/" target='_blank' rel='noreferrer' className="p text-white">careers</a>
                        </div>
                        <div className="help d-flex flex-column">
                            <h2>HELP</h2>
                            <a href="https://waves.pockethost.io/" target='_blank' rel='noreferrer' className="p text-white">connect us</a>
                            <a href="https://waves.pockethost.io/" target='_blank' rel='noreferrer' className="p text-white">about us</a>
                            <a href="https://waves.pockethost.io/" target='_blank' rel='noreferrer' className="p text-white">careers</a>
                        </div>
                        <div className="social me-lg-5 m-0 d-flex flex-column">
                            <h2>SOCIAL</h2>
                            <a href="https://waves.pockethost.io/" target='_blank' rel='noreferrer' className="p text-white">facebook</a>
                            <a href="https://waves.pockethost.io/" target='_blank' rel='noreferrer' className="p text-white">instegram</a>
                            <a href="https://waves.pockethost.io/" target='_blank' rel='noreferrer' className="p text-white">linkedin</a>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        <p>How can I contact support?</p>
                        <p>You can contact our support team via email at support <a className="text-primary" href="mailto:waves.devtech@gmail.com" target='_blank' rel='noreferrer' >waves.devtech@gmail.com</a> or by phone at <a href="tel:01095303755" className='text-primary' target='_blank' rel='noreferrer' >+201095303755</a></p>
                        <p> <span>E-mail : </span> <a className="text-primary" target='_blank' rel='noreferrer' href="mailto:waves.devtech@gmail.com:">waves.devtech@gmail.com</a> </p>
                        <p> <span>address : </span> <a className="text-primary" target='_blank' rel='noreferrer' href="https://maps.app.goo.gl/7Lb3N9vvmbtsM4ye8">Ihannasia Bani-suif</a> </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Footer;