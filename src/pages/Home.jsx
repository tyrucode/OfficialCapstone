
// intructions ui
function Home() {
    return (
        <div>
            <h1 className="howtoP">How to Play:</h1>
            <div className="steps-container">

                <div className='indiv-steps'>
                    Step 1:
                    <br />
                    Sign into your Spotify Account  <br />
                    &#40;Top Right&#x29;
                </div>
                <div className='indiv-steps'>
                    Step 2:
                    <br />
                    Choose either a personal playlist or a saved one from your library
                </div>
                <div className='indiv-steps'>Step 3:
                    <br />
                    Try to guess the song based on a snippet in under three guesses
                </div>
            </div>
            <h1>A Spotify Premium subscription is required to play this game.</h1>
            <h1>Due to API limitations, if you would like to try this app, I will need your Spotify email, which you can send me using one of the links below in the footer.</h1>
            <h1>In the meantime, scroll down & enjoy a demo video below!</h1>
            <iframe width="1200" height="600"
                src="https://www.youtube.com/embed/2GEESgQlijA"
                title="YouTube video player"
                frameborder="1"
                allowfullscreen>
            </iframe>
        </div>
    )
}

export default Home