gcloud config set project YOUR_GCP_PROJECT

gcloud functions deploy "api" \
    --trigger-http \
    --region=europe-west1 \
    --allow-unauthenticated \
