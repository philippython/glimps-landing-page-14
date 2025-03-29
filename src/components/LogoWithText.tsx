import { Image } from "lucide-react";
import { NavLink } from "react-router-dom";
import { FormattedMessage } from 'react-intl';

export default function LogoWithText() {
  return (
    <NavLink to="/" className="inline-flex items-center gap-2 justify-center">
      <div className="flex items-center justify-center rounded-md bg-glimps-900 p-1.5">
        <Image className="h-5 w-5 text-white" />
      </div>
      <span className="text-2xl font-bold tracking-tight text-glimps-900">
        <FormattedMessage id="common.glimps" />
      </span>
    </NavLink>
  )
}
