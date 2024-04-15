class Feature < ApplicationRecord
    # Validaciones
    validates :external_id, presence: true, uniqueness: true
    validates :magnitude, presence: true, numericality: { greater_than_or_equal_to: -1.0, less_than_or_equal_to: 10.0 }
    validates :place, presence: true
    validates :time, presence: true
    validates :url, presence: true
    validates :tsunami, inclusion: { in: [true, false] }
    validates :mag_type, presence: true
    validates :title, presence: true
    validates :longitude, presence: true, numericality: { greater_than_or_equal_to: -180.0, less_than_or_equal_to: 180.0 }
    validates :latitude, presence: true, numericality: { greater_than_or_equal_to: -90.0, less_than_or_equal_to: 90.0 }
  
    # Opcional: si hay relaciones con otros modelos, agrégalas aquí
    has_many :comments, dependent: :destroy
  
    # Opcional: definir métodos adicionales según sea necesario
  end
  
  