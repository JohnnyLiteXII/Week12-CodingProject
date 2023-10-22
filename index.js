


$(document).ready(function () {
    // When the document is fully loaded and ready, execute this function.

    const apiUrl = 'http://localhost:3000/games';
    // This defines the API URL where game data is stored.

    // Function to get and display games
    function getGames() {
        // This is a function to fetch and display game data from the API.
        $.get(apiUrl, function (data) {
            // This makes a GET request to the API URL and specify a callback function with the retrieved data.
            $('#game-list').empty();
            // Clear the content of the element with the ID 'game-list'.

            data.forEach(function (game) {
                // Loop through each game object in the retrieved data.
                $('#game-list').append(`
                <div class="container text-center mb-5 fs-2"> 
                    <div class="row">
                        <div class="col-sm-12 col-md-12 col-lg-6 mb-4">
                        <div class="card">
                        <h1>${game.title}</h1>
                        <p>Genre: ${game.genre}</p>
                        <p>Release Year: ${game.releaseYear}</p>
                        <button class="btn btn-sm btn-primary edit" data-id="${game.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete" data-id="${game.id}">Delete</button>
                        </div>
                        </div>
                    </div> 
                </div>   
                `);
                // Append(adds) a card with the game information to the 'game-list' element in the HTML
            });
        });
    }

    // Get games on page load
    getGames();
    // Call the 'getGames' function to retrieve and display game data when the page loads.

    // Add game
    $('#game-form').submit(function (e) {
        // When the game form is submitted, execute this function.
        e.preventDefault();
        // Prevent the default form submission behavior.
        const title = $('#title').val();
        const genre = $('#genre').val();
        const releaseYear = $('#releaseYear').val();
        // Get values entered for title, genre, and release year.

        if (title && genre && releaseYear) {
            // If all required fields have values:
            $.post(apiUrl, { title, genre, releaseYear }, function () {
                // Make a POST request to the API to add a new game with the specified data.
                getGames();
                // Call the 'getGames' function to refresh the game list.
                $('#title').val('');
                $('#genre').val('');
                $('#releaseYear').val('');
                // Clear the input fields after adding a game.
            });
        }
    });

    // Edit game
    $('#game-list').on('click', '.edit', function () {
        // When the 'Edit' button is clicked for a game, execute this function.
        const gameId = $(this).data('id');
        // Get the game ID from the data attribute of the clicked button.
        const gameElement = $(this).closest('.game');
        // Find the closest element with the class 'game' to the clicked button.
        const newTitle = prompt('Edit Game Title:', gameElement.find('h3').text());
        // Prompt the user to edit the game title and provide the current title as the default value.
        const newGenre = prompt('Edit Game Genre:', gameElement.find('p:contains("Genre:")').text().split(' ')[1]);
        // Prompt the user to edit the game genre and extract the current genre from the card.
        const newReleaseYear = prompt('Edit Release Year:', gameElement.find('p:contains("Release Year:")').text().split(' ')[2]);
        // Prompt the user to edit the release year and extract the current release year from the card.

        if (newTitle && newGenre && newReleaseYear) {
            // If the user provided new values for all fields:
            $.ajax({
                url: `${apiUrl}/${gameId}`,
                method: 'PUT',
                data: { title: newTitle, genre: newGenre, releaseYear: newReleaseYear },
                // Make a PUT request to update the game with new data.
                success: function () {
                    getGames();
                    // Call the 'getGames' function to refresh the game list.
                }
            });
        }
    });

    // Delete game
    $('#game-list').on('click', '.delete', function () {
        // When the 'Delete' button is clicked for a game, execute this function.
        const gameId = $(this).data('id');
        // Get the game ID from the data attribute of the clicked button.
        if (confirm('Delete this game?')) {
            // Display a confirmation dialog to confirm the deletion.
            $.ajax({
                url: `${apiUrl}/${gameId}`,
                method: 'DELETE',
                // Make a DELETE request to remove the game with the specified ID.
                success: function () {
                    getGames();
                    // Call the 'getGames' function to refresh the game list.
                }
            });
        }
    });
});
