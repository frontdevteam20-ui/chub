import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// TODO: Replace this with a secure method (e.g., env variable)
const CALENDLY_ACCESS_TOKEN = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzUyNTAxNjM0LCJqdGkiOiJmMmI0ZmE4ZC1iMzQ3LTQ2YzktODA2Ni1mNDA2Y2YwN2FiNTEiLCJ1c2VyX3V1aWQiOiIxYmI0NGE3YS1lY2EwLTRmNmEtOTA2Yi1hNzBiOTMzMzIzMmQifQ.cv0mOwuQM4C6TlTMUhGqM6tIhwNNL9_LSw_z6XYEWZcxFbD3238ygOZFLsVn23Gq7IaRHjQYHx2VKglChosBBA';
const CALENDLY_USER_URL = 'https://api.calendly.com/users/me';
const CALENDLY_EVENTS_URL = 'https://api.calendly.com/scheduled_events';
const CALENDLY_INVITEES_URL = 'https://api.calendly.com/scheduled_events/{event_uuid}/invitees';

// Async thunk for fetching Calendly events
export const fetchCalendlyEvents = createAsyncThunk(
  'calendly/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      // Step 1: Get organization URI
      const userRes = await fetch(CALENDLY_USER_URL, {
        headers: {
          'Authorization': `Bearer ${CALENDLY_ACCESS_TOKEN}`,
        },
      });

      if (!userRes.ok) {
        throw new Error(`User API error: ${userRes.status}`);
      }

      const userData = await userRes.json();
      const organizationUri = userData.resource.current_organization;

      // Step 2: Fetch all events with pagination
      let allEvents = [];
      let nextPageToken = null;

      do {
        const params = new URLSearchParams({
          organization: organizationUri,
          count: '100',
        });

        if (nextPageToken) {
          params.append('page_token', nextPageToken);
        }

        const eventsRes = await fetch(`${CALENDLY_EVENTS_URL}?${params}`, {
          headers: {
            'Authorization': `Bearer ${CALENDLY_ACCESS_TOKEN}`,
          },
        });

        if (!eventsRes.ok) {
          throw new Error(`Events API error: ${eventsRes.status}`);
        }

        const eventsData = await eventsRes.json();
        allEvents = [...allEvents, ...eventsData.collection];
        nextPageToken = eventsData.pagination?.next_page_token || null;
      } while (nextPageToken);

      // Step 3: Fetch invitees for each event
      const eventsWithInvitees = await Promise.all(
        allEvents.map(async (event) => {
          try {
            const eventUuid = event.uri.split('/').pop();
            const inviteesRes = await fetch(
              CALENDLY_INVITEES_URL.replace('{event_uuid}', eventUuid),
              {
                headers: {
                  'Authorization': `Bearer ${CALENDLY_ACCESS_TOKEN}`,
                },
              }
            );

            if (inviteesRes.ok) {
              const inviteesData = await inviteesRes.json();
              return {
                ...event,
                invitees: inviteesData.collection || [],
              };
            } else {
              return {
                ...event,
                invitees: [],
              };
            }
          } catch (error) {
            console.error(`Error fetching invitees for event ${event.uri}:`, error);
            return {
              ...event,
              invitees: [],
            };
          }
        })
      );

      return eventsWithInvitees;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching invitees for a specific event
export const fetchEventInvitees = createAsyncThunk(
  'calendly/fetchEventInvitees',
  async (eventUri, { rejectWithValue }) => {
    try {
      const eventUuid = eventUri.split('/').pop();
      const inviteesRes = await fetch(
        CALENDLY_INVITEES_URL.replace('{event_uuid}', eventUuid),
        {
          headers: {
            'Authorization': `Bearer ${CALENDLY_ACCESS_TOKEN}`,
          },
        }
      );

      if (!inviteesRes.ok) {
        throw new Error(`Invitees API error: ${inviteesRes.status}`);
      }

      const inviteesData = await inviteesRes.json();
      return {
        eventUri,
        invitees: inviteesData.collection || [],
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const calendlySlice = createSlice({
  name: 'calendly',
  initialState: {
    events: [],
    invitees: {}, // Map<event.uri, Invitee[]>
    loading: false,
    error: null,
    lastFetched: null,
    loadingInvitee: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearEvents: (state) => {
      state.events = [];
      state.invitees = {};
      state.lastFetched = null;
    },
    forceRefresh: (state) => {
      state.lastFetched = null; // This will trigger a fresh fetch
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchCalendlyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendlyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.lastFetched = Date.now();
        // Update invitees map
        action.payload.forEach(event => {
          if (event.invitees) {
            state.invitees[event.uri] = event.invitees;
          }
        });
      })
      .addCase(fetchCalendlyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch event invitees
      .addCase(fetchEventInvitees.pending, (state) => {
        state.loadingInvitee = true;
      })
      .addCase(fetchEventInvitees.fulfilled, (state, action) => {
        state.loadingInvitee = false;
        const { eventUri, invitees } = action.payload;
        state.invitees[eventUri] = invitees;
      })
      .addCase(fetchEventInvitees.rejected, (state) => {
        state.loadingInvitee = false;
      });
  },
});

export const { clearError, clearEvents, forceRefresh } = calendlySlice.actions;
export default calendlySlice.reducer;
