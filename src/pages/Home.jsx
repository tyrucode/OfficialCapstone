

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
        </div>
    )
}

export default Home