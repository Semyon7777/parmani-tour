import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Spinner } from "react-bootstrap";

function AdminRoute({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { navigate("/"); return; }

            const { data, error } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .maybeSingle();

            // Если ошибка или не админ — редирект
            if (error || !data?.is_admin) { navigate("/"); return; }
            
            setChecking(false);
        } catch {
            navigate("/");
        }
    };
    check();
  }, [navigate]);

  if (checking) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="success" />
    </div>
  );

  return children;
}

export default AdminRoute;