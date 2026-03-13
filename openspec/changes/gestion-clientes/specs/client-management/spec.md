# Client Management Specification

## Purpose

This specification defines the CRM (Client Relationship Management) system for the admin panel. It enables administrators to register, edit, view, and delete clients with their contact information, interests, and notes.

## Data Model

### Client Entity

The system MUST store client records with the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Client's first name |
| `lastName` | string | Yes | Client's last name |
| `phone` | string | Yes | Contact phone number |
| `email` | string | No | Email address |
| `address.street` | string | No | Street name |
| `address.number` | string | No | Street number |
| `address.city` | string | No | City name |
| `address.province` | string | No | Province name |
| `notes` | string | No | Free text notes about the client |
| `interests` | string[] | Yes | Array of interests: "vender", "comprar", "alquiler" |
| `preferredZone` | ObjectId | No | Reference to Zone/Barrio of interest |
| `preferredPropertyType` | ObjectId | No | Reference to PropertyType |
| `priceRange.min` | number | No | Minimum price of interest |
| `priceRange.max` | number | No | Maximum price of interest |
| `priceRange.operationType` | string | No | "venta" or "alquiler" |
| `status` | enum | Yes | "active" or "inactive" |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

### ClientMatch Entity

The system MUST store matches between clients:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sellerClient` | ObjectId | Yes | Reference to client selling |
| `buyerClient` | ObjectId | Yes | Reference to client buying |
| `zone` | ObjectId | Yes | Zone where match occurs |
| `propertyType` | ObjectId | Yes | Property type of match |
| `score` | number | Yes | Compatibility score (0-100) |
| `status` | enum | Yes | "pending", "contacted", "discarded" |
| `createdAt` | Date | Auto | When match was detected |
| `updatedAt` | Date | Auto | Last update timestamp |

## API Endpoints

### GET /api/clients

The system MUST provide a paginated list of clients.

#### Scenario: List all clients with pagination

- GIVEN there are clients stored in the database
- WHEN the admin requests GET /api/clients?page=1&limit=10
- THEN the system returns an array of clients with pagination metadata
- AND the response includes `total`, `page`, `limit`, `pages`

#### Scenario: Filter clients by interest

- GIVEN there are clients with different interests stored
- WHEN the admin requests GET /api/clients?interest=vender
- THEN the system returns only clients where "vender" is in the interests array

#### Scenario: Filter clients by status

- GIVEN there are active and inactive clients stored
- WHEN the admin requests GET /api/clients?status=active
- THEN the system returns only clients with status "active"

### POST /api/clients

The system MUST create a new client record.

#### Scenario: Create a new client with all fields

- GIVEN the admin provides valid client data with name, lastName, phone, interests
- WHEN the admin submits POST /api/clients with the data
- THEN the system creates a new client record
- AND returns the created client with 201 status
- AND triggers automatic matching process

#### Scenario: Create client with missing required fields

- GIVEN the admin provides incomplete client data (missing phone)
- WHEN the admin submits POST /api/clients with the data
- THEN the system returns a 400 error
- AND the error message indicates "El teléfono es requerido"

#### Scenario: Create client with invalid email format

- GIVEN the admin provides an invalid email format
- WHEN the admin submits POST /api/clients with email="invalid-email"
- THEN the system returns a 400 error
- AND the error message indicates "El formato del email es inválido"

#### Scenario: Create client triggers matching

- GIVEN there are existing clients in the database
- WHEN the admin creates a new client with "comprar" interest
- THEN the system automatically searches for matching "vender" clients
- AND creates ClientMatch records for compatible clients

### GET /api/clients/:id

The system MUST return a single client by ID.

#### Scenario: Get existing client

- GIVEN a client with ID "abc123" exists in the database
- WHEN the admin requests GET /api/clients/abc123
- THEN the system returns the client object with all fields
- AND populates preferredZone and preferredPropertyType references

#### Scenario: Get non-existent client

- GIVEN no client with ID "nonexistent" exists
- WHEN the admin requests GET /api/clients/nonexistent
- THEN the system returns a 404 error
- AND the error message indicates "Cliente no encontrado"

### PUT /api/clients/:id

The system MUST update an existing client.

#### Scenario: Update client successfully

- GIVEN a client with ID "abc123" exists
- WHEN the admin submits PUT /api/clients/abc123 with updated data
- THEN the system updates the client record
- AND returns the updated client
- AND triggers automatic matching process for updated client

#### Scenario: Update price range

- GIVEN a client with ID "abc123" has priceRange {min: 50000, max: 100000}
- WHEN the admin updates to priceRange {min: 75000, max: 150000}
- THEN the system updates the price range
- AND re-runs matching algorithm
- AND creates new matches if applicable

### DELETE /api/clients/:id

The system MUST soft-delete a client by setting status to "inactive".

#### Scenario: Delete (deactivate) client

- GIVEN a client with ID "abc123" exists and is active
- WHEN the admin submits DELETE /api/clients/abc123
- THEN the system sets the client status to "inactive"
- AND returns success message
- AND existing matches become invalid

## Matching API Endpoints

### POST /api/clients/match

The system MUST execute the matching algorithm manually.

#### Scenario: Run manual matching

- GIVEN there are clients with different interests in the database
- WHEN the admin submits POST /api/clients/match
- THEN the system analyzes all active clients
- AND creates ClientMatch records for compatible pairs
- AND returns the number of matches found

### GET /api/clients/matches

The system MUST return all matches.

#### Scenario: List all matches

- GIVEN there are matches stored in the database
- WHEN the admin requests GET /api/clients/matches
- THEN the system returns an array of ClientMatch objects
- AND includes populated sellerClient and buyerClient data

#### Scenario: Filter matches by status

- GIVEN there are matches with different statuses
- WHEN the admin requests GET /api/clients/matches?status=pending
- THEN the system returns only matches with status "pending"

### PUT /api/clients/matches/:id

The system MUST update match status.

#### Scenario: Mark match as contacted

- GIVEN a match with ID "match123" exists with status "pending"
- WHEN the admin submits PUT /api/clients/matches/match123 with status="contacted"
- THEN the system updates the match status to "contacted"
- AND returns the updated match

#### Scenario: Discard a match

- GIVEN a match with ID "match123" exists with status "pending"
- WHEN the admin submits PUT /api/clients/matches/match123 with status="discarded"
- THEN the system updates the match status to "discarded"
- AND the match is hidden from pending views

## UI Requirements

### Admin Clients Page

The system MUST display a responsive client management interface.

#### Scenario: View clients grid on desktop

- GIVEN the admin navigates to /admin/clients on a desktop screen
- THEN the system displays clients in a 3-column grid
- AND each card shows: name, lastName, phone, interests badges
- AND action buttons for edit and delete

#### Scenario: View clients list on mobile

- GIVEN the admin navigates to /admin/clients on a mobile screen
- THEN the system displays clients in a single-column layout
- AND each card is stacked vertically

#### Scenario: Open create client modal

- GIVEN the admin is on the clients page
- WHEN the admin clicks "Nuevo Cliente" button
- THEN the system opens a modal with the client form
- AND the form includes all fields: name, lastName, phone, email, address, interests, priceRange, preferredZone, preferredPropertyType, notes

#### Scenario: Edit client

- GIVEN the admin clicks the edit button on a client card
- THEN the system opens a pre-filled modal with the client's data
- AND changes can be saved or cancelled

#### Scenario: Delete confirmation

- GIVEN the admin clicks the delete button on a client card
- THEN the system shows a confirmation dialog "¿Estás seguro de eliminar este cliente?"
- AND on confirm, soft-deletes the client

### Admin Matches Page

The system MUST display matches between clients.

#### Scenario: View matches list

- GIVEN there are matches in the database
- WHEN the admin navigates to /admin/clients/matches
- THEN the system displays all matches as cards
- AND each card shows: seller ↔ buyer, zone, property type, score badge

#### Scenario: View match details

- GIVEN the admin clicks on a match card
- THEN the system expands to show full details of both clients
- INCLUDING: contact info, interests, price range, notes

#### Scenario: Badge count on dashboard

- GIVEN there are pending matches in the database
- WHEN the admin views the admin dashboard
- THEN the system displays a badge with the count of pending matches
- AND clicking navigates to /admin/clients/matches
