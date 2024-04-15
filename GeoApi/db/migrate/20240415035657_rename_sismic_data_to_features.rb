class RenameSismicDataToFeatures < ActiveRecord::Migration[7.1]
  def change
    rename_table :sismic_data, :features
  end
end
