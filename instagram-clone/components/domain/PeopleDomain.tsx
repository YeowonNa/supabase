"use client";

import AllPeopleList from "components/people/allPeopleList";
import PeopleService from "components/service/people/PeopleService";

export default function PeopleDomain() {
  const itemProps = PeopleService();

  return <AllPeopleList {...itemProps} />;
}
