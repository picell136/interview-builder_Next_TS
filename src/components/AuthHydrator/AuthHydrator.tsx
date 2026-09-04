"use client";

import { useEffect } from "react";
import { hydrateAuth } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";

export default function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return null;
}
