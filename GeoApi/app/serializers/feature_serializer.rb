class FeatureSerializer < ActiveModel::Serializer
  attributes :id, :type, :external_id, :magnitude, :place, :time, :tsunami, :mag_type, :title, :coordinates, :links

  def type
    'feature'
  end

  def coordinates
    {
      longitude: object.longitude,
      latitude: object.latitude
    }
  end

  def links
    {
      external_url: object.url
    }
  end
end
