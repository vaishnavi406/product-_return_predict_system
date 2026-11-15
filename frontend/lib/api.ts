export type OrderInput = {
  product_category: string;
  sub_category: string;
  brand: string;
  product_price: number;
  discount_percent: number;
  product_rating: number;
  review_count: number;
  fragile_item: number;
  warranty_available: number;
  product_return_rate: number;
  category_return_rate: number;
  brand_return_rate: number;
  defect_rate: number;
  seller_rating: number;
  seller_return_rate: number;
  fulfillment_type: string;
  payment_method: string;
  quantity: number;
  shipping_distance_km: number;
  delayed_delivery: number;
  wishlist_before_purchase: number;
  product_page_views: number;
  customer_support_calls: number;
  chat_interactions: number;
};

export type PredictionResponse = {
  return_probability: number;
  predicted_returned: boolean;
  risk_level: "Low" | "Medium" | "High";
};

export type MetricItem = {
  name: string;
  value: number;
};

export type FeatureImportanceItem = {
  feature: string;
  importance: number;
};

export type ModelInfo = {
  model_name: string;
  metrics: MetricItem[];
  feature_importance: FeatureImportanceItem[];
  threshold: number;
};

const DEFAULT_API_URL = "http://localhost:8000";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_URL;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchModelInfo(): Promise<ModelInfo> {
  return apiFetch<ModelInfo>("/model-info");
}

export async function predictReturn(order: OrderInput): Promise<PredictionResponse> {
  return apiFetch<PredictionResponse>("/predict", {
    method: "POST",
    body: JSON.stringify(order),
  });
}
