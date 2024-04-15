class FixColumnNameComments < ActiveRecord::Migration[7.1]
  def change
    rename_column :comments, :sismic_data_id, :feature_id
  end
end
