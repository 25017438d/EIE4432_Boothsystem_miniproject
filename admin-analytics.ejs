/*
 * Cheng Tsz Hung (25017438D)
 * Awwab Hamam (22103907D)
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const searchField = document.getElementById('searchTerm');
    const suggestionList = document.getElementById('eventSuggestions');
    const form = document.getElementById('eventSearchForm');

    if (!searchField || !suggestionList) {
      return;
    }

    let activeIndex = -1;
    let currentSuggestions = [];
    let controller;

    function hideSuggestions() {
      suggestionList.hidden = true;
      suggestionList.innerHTML = '';
      activeIndex = -1;
      currentSuggestions = [];
    }

    function renderSuggestions(suggestions) {
      if (!suggestions.length) {
        hideSuggestions();
        return;
      }

      currentSuggestions = suggestions;
      suggestionList.innerHTML = suggestions
        .map(
          (suggestion, index) =>
            `<button type="button" class="suggestion-item" data-suggestion-index="${index}">${suggestion}</button>`
        )
        .join('');
      suggestionList.hidden = false;
      activeIndex = -1;
    }

    async function fetchSuggestions(term) {
      const url = searchField.dataset.suggestUrl;
      if (!url) {
        return;
      }

      if (controller) {
        controller.abort();
      }
      controller = new AbortController();

      try {
        const response = await fetch(`${url}?term=${encodeURIComponent(term)}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        renderSuggestions(data.suggestions || []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          hideSuggestions();
        }
      }
    }

    searchField.addEventListener('input', (event) => {
      const term = event.target.value.trim();
      if (term.length < 2) {
        hideSuggestions();
        return;
      }
      fetchSuggestions(term);
    });

    searchField.addEventListener('keydown', (event) => {
      if (suggestionList.hidden) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        activeIndex = (activeIndex + 1) % currentSuggestions.length;
        updateActiveSuggestion();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = activeIndex <= 0 ? currentSuggestions.length - 1 : activeIndex - 1;
        updateActiveSuggestion();
      } else if (event.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < currentSuggestions.length) {
          event.preventDefault();
          selectSuggestion(currentSuggestions[activeIndex]);
        }
      } else if (event.key === 'Escape') {
        hideSuggestions();
      }
    });

    function updateActiveSuggestion() {
      const items = suggestionList.querySelectorAll('.suggestion-item');
      items.forEach((item, index) => {
        if (index === activeIndex) {
          item.classList.add('active');
          item.focus();
        } else {
          item.classList.remove('active');
        }
      });
    }

    function selectSuggestion(value) {
      searchField.value = value;
      hideSuggestions();
      if (form) {
        form.submit();
      }
    }

    suggestionList.addEventListener('click', (event) => {
      const button = event.target.closest('.suggestion-item');
      if (!button) {
        return;
      }
      const index = Number(button.dataset.suggestionIndex);
      if (!Number.isNaN(index)) {
        selectSuggestion(currentSuggestions[index]);
      }
    });

    document.addEventListener('click', (event) => {
      if (!suggestionList.contains(event.target) && event.target !== searchField) {
        hideSuggestions();
      }
    });
  });
})();

