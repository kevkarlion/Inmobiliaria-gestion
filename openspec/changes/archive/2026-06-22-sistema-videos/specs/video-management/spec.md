# Video Management Specification

## Purpose

This specification defines video upload and playback support for properties. It extends the existing Property model with a `videos` field, provides an upload API for video files to Cloudinary, and adds a video gallery section on the property detail page. The implementation follows the same pattern as the existing image handling.

## Data Model

### Property Entity — `videos` field

The system MUST extend the Property schema with a video URLs array.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `videos` | `string[]` | No | `[]` | Array of Cloudinary video URLs |

## API Endpoints

### POST /api/uploadVideo

The system MUST accept video file uploads to Cloudinary.

#### Scenario: Upload a valid video file

- GIVEN the user selects an mp4 file under 50MB
- WHEN the user submits POST /api/uploadVideo with the file
- THEN the system uploads the file to Cloudinary
- AND returns the Cloudinary video URL with 200 status

#### Scenario: Upload an invalid file type

- GIVEN the user selects a file with an unsupported extension (e.g. .avi)
- WHEN the user submits POST /api/uploadVideo with the file
- THEN the system rejects the upload with 400 status
- AND the error message indicates "Formato de video no soportado. Use mp4, webm o mov"

#### Scenario: Upload a file exceeding size limit

- GIVEN the user selects a video file larger than 50MB
- WHEN the user submits POST /api/uploadVideo with the file
- THEN the system rejects the upload with 400 status
- AND the error message indicates "El video no puede superar los 50MB"

### POST /api/properties (Create Property)

The system MUST accept videos when creating a property.

#### Scenario: Create property with videos

- GIVEN the user provides valid property data including videos array with 2 Cloudinary URLs
- WHEN the user submits POST /api/properties with the data
- THEN the system creates the property with the videos field persisted
- AND returns the created property including videos in the response

#### Scenario: Create property with more than 3 videos

- GIVEN the user provides a videos array with 4 Cloudinary URLs
- WHEN the user submits POST /api/properties with the data
- THEN the system rejects with 400 status
- AND the error message indicates "Una propiedad no puede tener más de 3 videos"

#### Scenario: Create property without videos

- GIVEN the user provides valid property data without a videos field
- WHEN the user submits POST /api/properties with the data
- THEN the system creates the property with videos defaulting to empty array
- AND returns the created property with videos: []

### PUT /api/properties/:id (Update Property)

The system MUST accept videos when updating a property.

#### Scenario: Add a video to existing property

- GIVEN a property with ID "prop123" exists with videos: []
- WHEN the user submits PUT /api/properties/prop123 with videos: ["https://res.cloudinary.com/.../video.mp4"]
- THEN the system updates the property with the new video URL
- AND returns the updated property with the new videos array

#### Scenario: Remove all videos from property

- GIVEN a property with ID "prop123" exists with videos: ["https://res.cloudinary.com/.../video.mp4"]
- WHEN the user submits PUT /api/properties/prop123 with videos: []
- THEN the system updates the property with an empty videos array
- AND returns the updated property with videos: []

#### Scenario: Replace videos exceeding limit on update

- GIVEN a property with ID "prop123" exists with videos: ["url1", "url2"]
- WHEN the user submits PUT /api/properties/prop123 with videos: ["url1", "url2", "url3", "url4"]
- THEN the system rejects with 400 status
- AND the error message indicates "Una propiedad no puede tener más de 3 videos"

## UI Requirements

### VideoUploader Component

The system SHOULD provide a reusable video upload component.

#### Scenario: Upload video via uploader

- GIVEN the user is on a property form with the VideoUploader component
- WHEN the user selects a valid video file (mp4, webm, mov) under 50MB
- THEN the system uploads the video to Cloudinary
- AND displays a Cloudinary thumbnail of the uploaded video
- AND shows the video filename below the thumbnail

#### Scenario: Remove individual video from uploader

- GIVEN the VideoUploader displays 2 uploaded videos with thumbnails
- WHEN the user clicks the remove button on the first video
- THEN the system removes the video URL from the local state
- AND the thumbnail disappears from the uploader

#### Scenario: Try to exceed video limit in uploader

- GIVEN the VideoUploader already has 3 videos uploaded
- WHEN the user attempts to select another video
- THEN the file input does not open
- AND the system shows a message "Máximo 3 videos por propiedad"

#### Scenario: Upload invalid file type via uploader

- GIVEN the user is on a property form
- WHEN the user selects a file with an unsupported format (e.g. .avi)
- THEN the system shows an error message "Formato de video no soportado. Use mp4, webm o mov"
- AND does not upload the file

### Property Create Form

The system SHOULD include a video section in the property creation form.

#### Scenario: Create property with videos via form

- GIVEN the user is on the create property form
- WHEN the user uploads 2 videos via VideoUploader
- AND fills in all required fields
- AND submits the form
- THEN the system creates the property with the 2 video URLs
- AND the detail page shows the video gallery

#### Scenario: Create property with 3 videos and verify limit

- GIVEN the user is on the create property form
- WHEN the user uploads 3 videos via VideoUploader
- THEN the uploader disables further uploads
- AND shows the limit message

### Property Edit Form

The system SHOULD load and allow modification of existing videos in the edit form.

#### Scenario: Edit property shows existing videos

- GIVEN a property with 2 existing videos is being edited
- WHEN the edit form loads
- THEN the VideoUploader displays the 2 existing videos with thumbnails
- AND the user can add or remove videos

#### Scenario: Remove all videos on edit

- GIVEN a property with 2 existing videos is being edited
- WHEN the user removes both videos via VideoUploader
- AND submits the form
- THEN the property is updated with videos: []

### Video Gallery on Detail Page

The system MUST display a video gallery on the property detail page.

#### Scenario: Show video gallery with thumbnails

- GIVEN a property with 3 videos exists
- WHEN the user navigates to the property detail page
- THEN the system displays a "Galería de Videos" section below the image gallery
- AND shows the 3 video thumbnails in a responsive grid (3 columns on desktop)

#### Scenario: Open video modal on thumbnail click

- GIVEN the video gallery displays thumbnails
- WHEN the user clicks on a video thumbnail
- THEN the system opens a full-screen modal overlay
- AND the modal contains an HTML5 video player with native controls
- AND the video starts playing automatically

#### Scenario: Close video modal

- GIVEN the video modal is open and playing a video
- WHEN the user clicks the close button or clicks outside the video
- THEN the modal closes
- AND the video stops playing

#### Scenario: Navigate between videos in modal

- GIVEN the video modal is open showing the first of 3 videos
- WHEN the user clicks the next button
- THEN the modal loads and plays the second video
- AND the video player controls are updated

### Empty State

The system MUST NOT render the video section when the property has no videos.

#### Scenario: No videos — gallery hidden

- GIVEN a property with videos: []
- WHEN the user navigates to the property detail page
- THEN the system does not render the video gallery section
- AND no empty placeholder or section title is shown

#### Scenario: Property with videos — gallery shown

- GIVEN a property with videos: ["https://res.cloudinary.com/.../video.mp4"]
- WHEN the user navigates to the property detail page
- THEN the system renders the "Galería de Videos" section
- AND shows the video thumbnail
