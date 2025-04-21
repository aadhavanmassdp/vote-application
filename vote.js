<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Superhero Voting</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js"></script>
</head>

<body class="bg-gray-100 min-h-screen flex flex-col justify-center items-center">

  <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md border-2 border-green-600">
    <h1 class="text-3xl font-bold text-center mb-6">Superhero Voting</h1>

    <label for="superhero" class="block text-lg font-semibold mb-2">Select your Superhero:</label>
    <select id="superhero" class="w-full border-gray-300 rounded-md py-2 px-3 mb-4">
      <option value="Iron Man">Iron Man</option>
      <option value="Captain America">Captain America</option>
      <option value="Hulk">Hulk</option>
    </select>

    <div class="flex justify-between mb-4">
      <button id="voteButton" class="bg-green-500 text-white px-4 py-2 rounded-md">Vote</button>
      <button id="clearButton" class="bg-red-500 text-white px-4 py-2 rounded-md">Clear Votes</button>
      <button id="pieChartButton" class="bg-purple-500 text-white px-4 py-2 rounded-md">Show Chart</button>
    </div>

    <div id="result" class="text-center text-lg font-medium mb-4"></div>
    <ul id="votedList" class="text-left text-gray-700 mb-4"></ul>

    <canvas id="pieChart" class="mt-6 hidden" width="300" height="300"></canvas>
  </div>

  <!-- Full JavaScript -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const superheroSelect = document.getElementById('superhero');
      const voteButton = document.getElementById('voteButton');
      const clearButton = document.getElementById('clearButton');
      const pieChartButton = document.getElementById('pieChartButton');
      const result = document.getElementById('result');
      const votedList = document.getElementById('votedList');
      const pieChartCanvas = document.getElementById('pieChart');
      let chartInstance;

      // Retrieve votes from localStorage
      function getVotes() {
        return JSON.parse(localStorage.getItem('votes')) || {};
      }

      // Save updated votes to localStorage
      function saveVotes(votes) {
        localStorage.setItem('votes', JSON.stringify(votes));
      }

      // Update the vote list UI
      function updateUI() {
        const votes = getVotes();
        const entries = Object.entries(votes);
        votedList.innerHTML = entries.length
          ? entries.map(([hero, count]) => `<li>${hero}: ${count} vote${count > 1 ? 's' : ''}</li>`).join('')
          : '<li>No votes yet</li>';
      }

      // Render the pie chart
      function renderChart() {
        const votes = getVotes();
        const labels = Object.keys(votes);
        const data = Object.values(votes);

        if (chartInstance) {
          chartInstance.destroy();
        }

        if (labels.length > 0) {
          pieChartCanvas.classList.remove('hidden');
          const ctx = pieChartCanvas.getContext('2d');
          chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [{
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: { display: true },
                title: {
                  display: true,
                  text: 'Superhero Voting Results'
                }
              }
            }
          });
        } else {
          pieChartCanvas.classList.add('hidden');
        }
      }

      // Vote button functionality
      voteButton.addEventListener('click', () => {
        const selectedHero = superheroSelect.value;
        const votes = getVotes();
        votes[selectedHero] = (votes[selectedHero] || 0) + 1;
        saveVotes(votes);
        result.textContent = `You voted for ${selectedHero}!`;
        updateUI();
      });

      // Clear button functionality
      clearButton.addEventListener('click', () => {
        localStorage.removeItem('votes');
        result.textContent = 'Votes have been cleared!';
        updateUI();
        if (chartInstance) {
          chartInstance.destroy();
        }
        pieChartCanvas.classList.add('hidden');
      });

      // Show chart button functionality
      pieChartButton.addEventListener('click', renderChart);

      // Initial load
      updateUI();
    });
  </script>
</body>

</html>
