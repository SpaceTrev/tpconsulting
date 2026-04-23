/* First make sure that you have installed the package */

/* If you are using yarn */

// yarn add @calcom/atoms

/* If you are using npm */

// npm install @calcom/atoms

import { BookerEmbed } from "@calcom/atoms";

// You might need to define or import BookerProps depending on your setup

// For example: type BookerProps = { eventTypeSlug: string; calUsername: string; /* other props */ };

export default function Booker( props : BookerProps ) {

  return (

    <>

      <BookerEmbed

        // Use the parsed username and event slug from calLink

        eventSlug={eventSlug}

        // layout can be of three types: COLUMN_VIEW, MONTH_VIEW or WEEK_VIEW, 

        // you can choose whichever you prefer

        view="month_view"

        username={calUsername}

        customClassNames={{

          bookerContainer: "border-subtle border",

        }}

        onCreateBookingSuccess={() => {

          console.log("booking created successfully");

        }}

      />

    </>

  );

};