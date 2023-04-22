

class HeaderComponet extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="header">
                <div className="header__logo">
                    <img src="/images/logo.png" alt="logo" />
                </div>
                <div className="header__menu">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
            </div>
        );
    }
}