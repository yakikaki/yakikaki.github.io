class SpecialHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="/css/header.css">
            <header class="header">
                <a href="/" ><img src= "/assets/PlainLogo.png" class="nav-logo"></a>
                <nav class="navbar">
                    <ul class="nav-menu">
                        <li class="nav-item">
                            <a href="/store" class="nav-link">Store</a>
                        </li>
                        <li class="nav-item">
                            <a href="/tools" class="nav-link">Tools</a>
                        </li>
                        <li class="nav-item">
                            <a href="/projects" class="nav-link">Projects</a>
                        </li>
                        <li class="nav-item">
                            <a href="/ironengine" class="nav-link">IronEngine</a>
                        </li>
                    </ul>
                    <div class="hamburger">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </div>
                </nav>
            </header> 
            <script src="/javascript/responsive-header.js"></script>
        `;
    }
}

class SpecialFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="/css/footer.css">
            <footer>
                <div class="footerContainer">
                    <div class="socialIcons">
                        <a href="https://www.twitter.com/yakikaki69/"><i class="fa-brands fa-x-twitter"></i></a>
                        <a href="https://www.instagram.com/yakikaki_/"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://www.youtube.com/channel/UC7vtYQkWnHMOxuHxsWvjo9g"><i class="fa-brands fa-youtube"></i></a>
                        <a href="https://www.discord.gg/hFUX6R2kuU"><i class="fa-brands fa-discord"></i></a>
                    </div>  

                
                    <div class="footerNav">
                    </div>
                    
                    <div class="footerBottom">
                            <p>Copyright &copy;2022-2024 <span class="company">YakiStudios</span></p>
                    
                    </div>
                    <div class="socialIcons"><a href="mailto:business@yakistudios.com"><i class="fa-solid fa-envelope"></i></a> <span style="color: white; margin-top: 30px"><a href="mailto:business@yakistudios.com" style="background-color:transparent; color:white">Contact</a></span>
                    </div>
                </div>
            </footer>
            <script src="/javascript/css-js.js"></script>  
        `;
    }
}

customElements.define('custom-header', SpecialHeader);
customElements.define('custom-footer', SpecialFooter);