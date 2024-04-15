Rails.application.routes.draw do
  get 'features/index'
  namespace :api do
      resources :features, only: [:index] do
      resources :comments, only: [:create]
    end
  end
end

