namespace :fetch do
    desc "Fetch sismic data from USGS and persist to database"
    task sismic_data: :environment do
      require 'rest-client'
      require 'json'
      require_relative '../../app/models/feature.rb'
  
      url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
      response = RestClient.get(url)
      data = JSON.parse(response.body)
  
      data['features'].each do |feature|
        next unless feature['properties']['title'] &&
                    feature['properties']['url'] &&
                    feature['properties']['place'] &&
                    feature['properties']['magType'] &&
                    feature['geometry']['coordinates'][0] &&
                    feature['geometry']['coordinates'][1] &&
                    feature['properties']['mag'] >= -1.0 &&
                    feature['properties']['mag'] <= 10.0 &&
                    feature['geometry']['coordinates'][1] >= -90.0 &&
                    feature['geometry']['coordinates'][1] <= 90.0 &&
                    feature['geometry']['coordinates'][0] >= -180.0 &&
                    feature['geometry']['coordinates'][0] <= 180.0
  
        # Check if the record already exists to avoid duplicates
        unless Feature.exists?(external_id: feature['id'])
          Feature.create!(
            external_id: feature['id'],
            magnitude: feature['properties']['mag'],
            place: feature['properties']['place'],
            time: Time.at(feature['properties']['time'] / 1000), # Convert Unix timestamp to DateTime
            url: feature['properties']['url'],
            tsunami: feature['properties']['tsunami'],
            mag_type: feature['properties']['magType'],
            title: feature['properties']['title'],
            longitude: feature['geometry']['coordinates'][0],
            latitude: feature['geometry']['coordinates'][1]
          )
        end
      end
    end
  end
  