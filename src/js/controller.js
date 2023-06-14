import * as Model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/BookmarksView.js'
import addRecipeView from './views/addRecipeView.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)

    if (!id) return

    recipeView.renderSpinner()

    // 0) Update results views to mark selected search result
    resultsView.update(Model.getSearchResultsPage())

    bookmarksView.update(Model.state.bookmarks)

    // 1) Loading recipe
    await Model.loadRecipe(id)

    // 2) Rendering recipe
    recipeView.render(Model.state.recipe)
  } catch (err) {
    recipeView.renderError()
  }
}

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner()

    // 1) Get search query
    const query = searchView.getQuery()
    if (!query) return

    // 2) Load search result
    await Model.loadRSearchResults(query)

    // 3) Render results
    // resultsView.render(Model.state.search.results);
    resultsView.render(Model.getSearchResultsPage())

    // 4) Render intitial pagination buttons
    paginationView.render(Model.state.search)
  } catch (err) {}
}

const controlPagination = function (goToPage) {
  // 1) Render New results
  resultsView.render(Model.getSearchResultsPage(goToPage))

  // 2) Render New pagination buttons
  paginationView.render(Model.state.search)
}

const controlServings = function (newServings) {
  // Update the recipe (in state)
  Model.updateServings(newServings)

  // Update the recipe view
  // recipeView.render(Model.state.recipe);
  recipeView.render(Model.state.recipe)
}

const controlAddBookmark = function () {
  // 1) Add/remove bookmarks
  if (!Model.state.recipe.bookmarked) Model.addBookmark(Model.state.recipe)
  else Model.deleteBookmark(Model.state.recipe.id)

  // 2) Update the recipe (in state)
  recipeView.render(Model.state.recipe)

  // 3) Render bookmarks
  bookmarksView.render(Model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(Model.state.bookmarks)
}

const controlAddRecipe = function (newRecipe) {
  console.log(newRecipe)

  // Upload the new recipe data
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResult)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
  console.log('Welcome')
}
init()
