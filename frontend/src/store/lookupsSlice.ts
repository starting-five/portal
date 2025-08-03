import { getLookups } from "@/lib/api/lookups";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchLookups = createAsyncThunk(
  "lookups/fetchLookups",
  async (_, thunkAPI) => {
    try {
      // console.log("Fetching lookups...");
      const data = await getLookups();
      // console.log("Lookups fetched successfully:", data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

interface LookupsState {
  ownership_types: object[];
  listing_types: object[];
  listing_statuses: object[];
  locations: object[];
  features: object[];
  features_by_id: { [id: number]: object };
  loading: boolean;
  error: string | null;
}

const initialState: LookupsState = {
  ownership_types: [],
  listing_types: [],
  listing_statuses: [],
  locations: [],
  features: [],
  features_by_id: {},
  loading: false,
  error: null,
};

const lookupsSlice = createSlice({
  name: "lookups",
  initialState,
  reducers: {
    setLookups(state, action) {
      // Hydrate all lookup arrays from SSR
      state.ownership_types = action.payload.ownership_types || [];
      state.listing_types = action.payload.listing_types || [];
      state.listing_statuses = action.payload.listing_statuses || [];
      state.locations = action.payload.locations || [];
      state.features = action.payload.features || [];
      // feature_categories removed
      // Flatten all items from each feature section into features_by_id
      const featuresById: { [id: number]: object } = {};
      (state.features || []).forEach((section: any) => {
        if (Array.isArray(section.items)) {
          section.items.forEach((item: any) => {
            featuresById[item.id] = item;
          });
        }
      });
      state.features_by_id = featuresById;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLookups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLookups.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Adjust this to match your API response structure
        state.ownership_types = action.payload.ownership_types || [];
        state.listing_types = action.payload.listing_types || [];
        state.listing_statuses = action.payload.listing_statuses || [];
        state.locations = action.payload.locations || [];
        state.features = action.payload.features || [];
        // Flatten all items from each feature section into features_by_id
        const featuresById: { [id: number]: object } = {};
        (state.features || []).forEach((section: any) => {
          if (Array.isArray(section.items)) {
            section.items.forEach((item: any) => {
              featuresById[item.id] = item;
            });
          }
        });
        state.features_by_id = featuresById;
      })
      .addCase(fetchLookups.rejected, (state, action) => {
        state.loading = false;
        // Ensure error is always a string or null
        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (action.error && typeof action.error.message === "string") {
          state.error = action.error.message;
        } else {
          state.error = "Failed to fetch lookups";
        }
      });
  },
});

export const { setLookups } = lookupsSlice.actions;
export default lookupsSlice.reducer;
