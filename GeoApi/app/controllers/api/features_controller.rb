module Api
  class FeaturesController < ApplicationController
    MAX_PER_PAGE = 1000
    def index
      features = Feature.all
      features = apply_filters(features)
      features = paginate_features(features)

      render json: {
        data: ActiveModelSerializers::SerializableResource.new(features, each_serializer: FeatureSerializer),
        pagination: {
          current_page: features.current_page,
          total: features.total_count,
          total_pages: features.total_pages,
          per_page: features.limit_value
        }
      }, status: :ok
    end

    private

    def apply_filters(features)
      features = features.where(mag_type: params[:filters][:mag_type].split(',')) if params[:filters].present? && params[:filters][:mag_type].present?
      features
    end

    def paginate_features(features)
      per_page = [params[:per_page].to_i, MAX_PER_PAGE].min
      features.page(params[:page]).per(per_page || 25)
    end
  end
end


